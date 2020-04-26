import { EventEmitter } from 'events';

import { ImagesApiConfig, ImagesApi } from './imagesApi';
import { WebhookServer } from './server/webhookServer';
import { Middleware } from './middleware/middleware';
import { ApiRequest } from './api/request';
import { Context } from './context';
import { ApiResponse } from './api/response';
import { ALICE_PROTOCOL_VERSION } from './constants';
import { CommandCallback, CommandDeclaration } from './command/command';
import debug from './debug';

import { MainStage } from './stage/mainScene';
import { Scene } from './stage/scene';

export type AliceConfig = ImagesApiConfig

export class Alice {
  private readonly _config: AliceConfig;
  private readonly _middlewares: Middleware[];
  private readonly _imagesApi: ImagesApi;
  private readonly _mainStage: MainStage;
  private _eventEmitter: EventEmitter;

  constructor(config: AliceConfig = {}) {
    this._eventEmitter = new EventEmitter();
    this._config = config;
    this.handleRequest = this.handleRequest.bind(this);

    this._middlewares = [];
    this._imagesApi = new ImagesApi(this._config);
    this._mainStage = new MainStage();
  }

  private _buildContext(request: ApiRequest): Context {
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

  private async _runMiddlewares(context: Context): Promise<Context> {
    const middlewares = Array.from(this._middlewares);
    // mainStage middleware should always be the latest one
    middlewares.push(this._mainStage.middleware);
    if (middlewares.length === 0) {
      return context;
    }

    let index = 0;
    const next = async (middlewareContext: Context): Promise<Context> => {
      const middleware = middlewares[index];
      index++;
      return middleware(
        middlewareContext,
        index >= middlewares.length ? null : next,
      );
    };
    return next(context);
  }

  get imagesApi(): ImagesApi {
    return this._imagesApi;
  }

  public async handleRequest(data: ApiRequest): Promise<ApiResponse> {
    if (data.version !== ALICE_PROTOCOL_VERSION) {
      throw new Error('Unknown protocol version');
    }
    debug(`incoming request: ${data.request.command}`);
    const context = this._buildContext(data);
    // trigger request event
    this._eventEmitter.emit('request', context);

    const newContext = await this._runMiddlewares(context);
    if (!newContext.response) {
      throw new Error(
        'No response for request ' +
          `"${context.data.request.command}"` +
          '. Try add command for it or add default command.' +
          '${context.response} not found. Check out your middlewares',
      );
    }

    // trigger response event
    this._eventEmitter.emit('response', newContext);

    debug(`outcoming result: ${newContext.response.text}`);
    return {
      response: newContext.response,
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
    declaration: CommandDeclaration,
    callback: CommandCallback,
  ): void {
    this._mainStage.scene.command(declaration, callback);
  }

  public any(callback: CommandCallback): void {
    this._mainStage.scene.any(callback);
  }

  public registerScene(scene: Scene): void {
    this._mainStage.stage.addScene(scene);
  }

  public on(
    type: 'response' | 'request',
    callback: (context: Context) => any,
  ): void {
    this._eventEmitter.addListener(type, callback);
  }
}
