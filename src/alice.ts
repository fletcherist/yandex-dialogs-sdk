import * as http from 'http';
import { IImagesApiConfig, IImagesApi, ImagesApi } from './imagesApi';
import { Middleware, IMiddlewareResult } from './middleware/middleware';
import { IApiRequest } from './api/request';
import { IContext } from './context';
import { IApiResponse } from './api/response';
import { ALICE_PROTOCOL_VERSION } from './constants';
import { Reply } from './reply/reply';

export interface IAliceConfig extends IImagesApiConfig {}

export interface IAlice {
  readonly imagesApi: IImagesApi;
  handleRequest(data: IApiRequest): Promise<IApiResponse>;
  use(middleware: Middleware): void;
}

export class Alice implements IAlice {
  private readonly _config: IAliceConfig;
  private readonly _middlewares: Middleware[];
  private readonly _imagesApi: IImagesApi;
  private _server: object | null;

  constructor(config: IAliceConfig) {
    this._config = config;
    this._middlewares = [];
    this._imagesApi = new ImagesApi(this._config);
    this._server = null;
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
      const middleware = middlewares[index--];
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
    callback?: () => void,
  ) {
    this._server = http
      .createServer(
        async (request: http.ServerRequest, response: http.ServerResponse) => {
          const body: (string | Buffer)[] = [];
          request
            .on('data', chunk => {
              body.push(chunk);
            })
            .on('end', async () => {
              const requestData = Buffer.from(body).toString();
              if (request.method === 'POST' && request.url === webhookUrl) {
                try {
                  const requestBody = JSON.parse(requestData);
                  const responseBody = await this.handleRequest(requestBody);
                  response.statusCode = 200;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify(responseBody));
                } catch (error) {
                  throw new Error(error);
                }
              } else {
                response.statusCode = 400;
                return response.end();
              }
            });
        },
      )
      .listen(port, () => {
        if (typeof callback === 'function') {
          return callback();
        }
      });
    return this._server;
  }

  public use(middleware: Middleware): void {
    this._middlewares.push(middleware);
  }
}
