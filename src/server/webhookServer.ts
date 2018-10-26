import * as http from 'http';
import debug from '../debug';
import { IApiRequest } from '../api/request';
import { IApiResponse } from '../api/response';

type HandleAliceRequestType = (request: IApiRequest) => Promise<IApiResponse>;

export interface IWebhookServerConfig {
  port: number;
  webhookUrl: string;
  options: object;
  handleRequest: HandleAliceRequestType;
}
export interface IWebhookServer {
  start(): void;
  stop(): void;
}

function isAvailableMethod(method: string | undefined): boolean {
  if (method === undefined) {
    return false;
  }
  return ['POST', 'OPTIONS'].includes(method);
}

function formatWebhookUrl(webhookUrl: string): string {
  if (webhookUrl === '') {
    return '/';
  }
  return webhookUrl;
}

export class WebhookServer {
  private _server: http.Server;
  private _port: number;
  private _webhookUrl: string;
  private _isStarted: boolean;
  private _handleAliceRequest: HandleAliceRequestType;

  constructor(config: IWebhookServerConfig) {
    this._port = config.port;
    this._webhookUrl = formatWebhookUrl(config.webhookUrl);
    this._handleAliceRequest = config.handleRequest;
    this._isStarted = false;

    debug(`starting webhook server`);
    this._server = http.createServer((request, response) =>
      this._handleRequest(request, response),
    );
  }

  private async _handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ): Promise<void> {
    if (!isAvailableMethod(request.method) ||
        request.url !== this._webhookUrl) {
      response.statusCode = 400;
      return response.end();
    }

    const requestBody = await WebhookServer._readRequest(request);
    const responseBody = await this._handleAliceRequest(requestBody);
    WebhookServer._sendResponse(response, responseBody);
  }

  private static _readRequest(
    request: http.IncomingMessage,
  ): Promise<IApiRequest> {
    return new Promise((resolve, reject) => {
      const body: Buffer[] = [];
      request
        .on('data', chunk => {
          if (typeof chunk === 'string') {
            body.push(Buffer.from(chunk));
            return;
          }
          body.push(chunk);
        })
        .on('end', async () => {
          const requestData = Buffer.concat(body).toString();
          resolve(JSON.parse(requestData));
        })
        .on('error', reject);
    });
  }
  private static async _sendResponse(
    response: http.ServerResponse,
    responseBody: IApiResponse,
  ) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(responseBody));
  }

  public start(): void {
    if (this._isStarted) {
      throw new Error(`Server is already started`);
    }
    this._server.listen(this._port, () => {
      debug(`server is listening on ${this._port}, '${this._webhookUrl}'`);
      this._isStarted = true;
    });
  }

  public stop(): void {
    if (!this._isStarted) {
      return;
    }
    debug(`stopping webhook server`);
    this._server.close();
    this._isStarted = false;
  }
}
