import { IImagesApiConfig, IImagesApi, ImagesApi } from './imagesApi';
import { WebhookServer, IWebhookServer } from './server/webhookServer';
import { Middleware, IMiddlewareResult } from './middleware/middleware';
import { IApiRequest } from './api/request';
import { IContext } from './context';
import { IApiResponse } from './api/response';
import { ALICE_PROTOCOL_VERSION } from './constants';
import { CommandCallback, CommandDeclaration } from './command/command';
import { InMemorySessionStorage } from './session/inMemorySessionStorage';
import { sessionMiddleware } from './session/sessionMiddleware';
import debug from './debug';

import { MainStage } from './stage/mainScene';
import { ISessionStorage } from './session/session';
import { IScene } from './stage/scene';

export interface IAliceConfig extends IImagesApiConfig {
  sessionStorage?: ISessionStorage;
}

export interface IAlice {
  readonly imagesApi: IImagesApi;
  handleRequest(data: IApiRequest): Promise<IApiResponse>;
  use(middleware: Middleware): void;
  listen(port: number, webhookUrl: string, options: object): IWebhookServer;
}

export class Alice implements IAlice {
  private readonly _config: IAliceConfig;
  private readonly _middlewares: Middleware[];
  private readonly _imagesApi: IImagesApi;
  private readonly _mainStage: MainStage;
  private readonly _sessionStorage: ISessionStorage;

  constructor(config: IAliceConfig = {}) {
    this._config = config;
    this.handleRequest = this.handleRequest.bind(this);

    this._middlewares = [];
    this._imagesApi = new ImagesApi(this._config);
    this._mainStage = new MainStage();

    this._sessionStorage =
      config.sessionStorage || new InMemorySessionStorage();
    this.use(sessionMiddleware(this._sessionStorage));
  }

  private _buildContext(request: IApiRequest): IContext {
    return {
      data: request,
      message: request.request.command,
      originalUtterance: request.request.original_utterance,
      sessionId: request.session.session_id,
      messageId: request.session.message_id,
      userId: request.session.user_id,
      payload: request.request.payload,
      nlu: request.request.nlu,
    };
  }

  private async _runMiddlewares(
    context: IContext,
  ): Promise<IMiddlewareResult | null> {
    const middlewares = Array.from(this._middlewares);
    // mainStage middleware should always be the latest one
    middlewares.push(this._mainStage.middleware);
    if (middlewares.length === 0) {
      return null;
    }

    let index = 0;
    const next = async (
      middlewareContext: IContext,
    ): Promise<IMiddlewareResult | null> => {
      const middleware = middlewares[index];
      index++;
      return middleware(
        middlewareContext,
        index >= middlewares.length ? null : next,
      );
    };
    return next(context);
  }

  get imagesApi(): IImagesApi {
    return this._imagesApi;
  }

  public async handleRequest(data: IApiRequest): Promise<IApiResponse> {
    if (data.version !== ALICE_PROTOCOL_VERSION) {
      throw new Error('Unknown protocol version');
    }
    debug(`incoming request: ${data.request.command}`);
    const context = this._buildContext(data);
    const result = await this._runMiddlewares(context);
    if (!result) {
      throw new Error(
        'No response for request ' +
          `"${context.data.request.command}"` +
          '. Try add command for it or add default command.',
      );
    }

    debug(`outcoming result: ${result.text}`);
    return {
      response: result,
      session: {
        message_id: data.session.message_id,
        session_id: data.session.session_id,
        user_id: data.session.user_id,
      },
      version: ALICE_PROTOCOL_VERSION,
    };
  }

  public listen(
    port: number = 80,
    webhookUrl: string = '/',
    options: object = {},
  ): WebhookServer {
    const server = new WebhookServer({
      port: port,
      webhookUrl: webhookUrl,
      options: options,
      handleRequest: this.handleRequest,
    });
    server.start();
    return server;
  }

  public use(middleware: Middleware): void {
    this._middlewares.push(middleware);
  }

  public command(
    declaration: CommandDeclaration<IContext>,
    callback: CommandCallback<IContext>,
  ): void {
    this._mainStage.scene.command(declaration, callback);
  }

  public any(callback: CommandCallback<IContext>): void {
    this._mainStage.scene.any(callback);
  }

  public registerScene(scene: IScene): void {
    this._mainStage.stage.addScene(scene);
  }
}
