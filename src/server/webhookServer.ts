import * as http from 'http';
import debug from '../debug';
import { IApiRequest } from '../api/request';
import { IApiResponse } from '../api/response';

type handleAliceRequestType = (request: IApiRequest) => Promise<IApiResponse>;

export interface IWebhookServerConfig {
  port: number;
  webhookUrl: string;
  options: object;
  handleRequest: handleAliceRequestType;
}
export interface IWebhookServer {
  start(): void;
  stop(): void;
}

export class WebhookServer {
  private server: http.Server;
  private port: number;
  private webhookUrl: string;
  private _isStarted: boolean;
  private _handleAliceRequest: handleAliceRequestType;

  constructor(config: IWebhookServerConfig) {
    this.port = config.port;
    this.webhookUrl = config.webhookUrl;
    this._handleAliceRequest = config.handleRequest;
    this._isStarted = false;

    debug(`server is listening: ${this.port}, ${this.webhookUrl}`);
    this.server = http.createServer((request, response) =>
      this._handleRequest(request, response),
    );
  }

  private async _handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ): Promise<void> {
    if (request.method !== 'POST' || request.url !== this.webhookUrl) {
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
      const body: Array<string | Buffer> = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', async () => {
          const requestData = Buffer.from(body).toString();
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
    this.server.listen(this.port, () => {
      debug(`server is listening on ${this.port}, '${this.webhookUrl}'`);
      this._isStarted = true;
    });
  }

  public stop(): void {
    if (!this._isStarted) {
      return;
    }
    debug(`stopping webhook server`);
    this.server.close();
    this._isStarted = false;
  }
}
