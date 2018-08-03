import { IImagesApiConfig, IImagesApi, ImagesApi } from "./imagesApi";
import { Middleware, IMiddlewareResult } from "./middleware/middleware";
import { IApiRequest } from "./api/request";
import { IContext } from "./context";
import { IApiResponse } from "./api/response";
import { ALICE_PROTOCOL_VERSION } from "./constants";
import { Reply } from "./reply/reply";

export interface IAliceConfig extends IImagesApiConfig {

}

export interface IAlice {
  readonly imagesApi: IImagesApi;
  handleRequest(data: IApiRequest): Promise<IApiResponse>;
  use(middleware: Middleware): void
}

export class Alice implements IAlice {
  private readonly _config: IAliceConfig;
  private readonly _middlewares: Middleware[];
  private readonly _imagesApi: IImagesApi;

  constructor(config: IAliceConfig) {
    this._config = config;
    this._middlewares = [];
    this._imagesApi = new ImagesApi(this._config);
  }

  private _buildContext(request: IApiRequest): IContext {
    return {
      data: request,
    }
  }

  private async _runMiddlewares(
    context: IContext
  ): Promise<IMiddlewareResult | null> {
    const middlewares = Array.from(this._middlewares);
    if (middlewares.length <= 0) {
      return null;
    }

    let index = middlewares.length - 1;
    const next = async (context: IContext): Promise<IMiddlewareResult | null> => {
      const middleware = middlewares[index];
      index--;
      return middleware(context, index <= 0 ? null : next);
    }
    return next(context);
  }

  get imagesApi(): IImagesApi {
    return this._imagesApi;
  }

  public async handleRequest(data: IApiRequest): Promise<IApiResponse> {
    if (data.version !== ALICE_PROTOCOL_VERSION) {
      throw new Error('Unknown protocol version');
    }

    const context = this._buildContext(data);
    const result = await this._runMiddlewares(context);
    if (!result) {
      throw new Error(
          'No response for request ' + context.data.request.command + ' ' +
          'Try add command for it or add default command');
    }

    return {
      response: result.responseBody,
      session: {
        message_id: data.session.message_id,
        session_id: data.session.session_id,
        user_id: data.session.user_id,
      },
      version: ALICE_PROTOCOL_VERSION,
    }
  }

  public use(middleware: Middleware): void {
    this._middlewares.push(middleware);
  }
}
