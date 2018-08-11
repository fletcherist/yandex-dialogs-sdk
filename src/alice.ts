import { IImagesApiConfig, IImagesApi, ImagesApi } from './imagesApi';
import { WebhookServer, IWebhookServer } from './server/webhookServer';
import { Middleware, IMiddlewareResult } from './middleware/middleware';
import { IApiRequest } from './api/request';
import { IContext } from './context';
import { IApiResponse } from './api/response';
import { ALICE_PROTOCOL_VERSION } from './constants';
import { Stage, IStage } from './stage/stage';
import { Scene, IScene } from './stage/scene';
import { CommandCallback, CommandDeclaration } from './command/command';
import { StageСompere } from './stage/compere';
import debug from './debug';

export interface IAliceConfig extends IImagesApiConfig {}

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
  private _mainStage: IStage;
  private _mainScene: IScene;

  constructor(config: IAliceConfig = {}) {
    this._config = config;
    this._middlewares = [];
    this._imagesApi = new ImagesApi(this._config);
    this._mainStage = new Stage();
    this._mainScene = new Scene('main');
    this._mainStage.addScene(this._mainScene);
    this.use(this._mainStage.getMiddleware());
  }

  private _buildContext(request: IApiRequest): IContext {
    return {
      data: request,
    };
  }

  private async _runMiddlewares(
    context: IContext,
  ): Promise<IMiddlewareResult | null> {
    const middlewares = Array.from(this._middlewares);
    if (middlewares.length === 0) {
      return null;
    }

    let index = middlewares.length - 1;
    const next = async (
      context: IContext,
    ): Promise<IMiddlewareResult | null> => {
      const middleware = middlewares[index];
      index--;
      return middleware(context, index <= 0 ? null : next);
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
    debug('>> ', data.request.command);
    const context = this._buildContext(data);
    const result = await this._runMiddlewares(context);
    if (!result) {
      throw new Error(
        'No response for request ' +
          context.data.request.command +
          ' ' +
          'Try add command for it or add default command',
      );
    }

    return {
      response: result.responseBody,
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
    this._mainScene.command(declaration, callback);
  }

  public any(callback: CommandCallback<IContext>): void {
    this._mainScene.any(callback);
    // this._anyCommand = new Command(Command.createMatcherAlways(), callback);
  }
}
