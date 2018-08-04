import * as http from 'http';
import _debug from 'debug';
import { LIBRARY_NAME } from '../constants';
import { IAlice } from '../alice';

const debug = _debug(LIBRARY_NAME);

export interface IWebhookServerConfig {
  port: number;
  webhookUrl: string;
  options: object;
  handleRequest: IAlice['handleRequest'];
}
export interface IWebhookServer {
  start(): void;
  stop(): void;
}

export class WebhookServer {
  private server: http.Server;
  private port: number;
  private webhookUrl: string;
  private isServerStarted: boolean;
  private handleRequest: IAlice['handleRequest'];

  constructor(config: IWebhookServerConfig) {
    this.port = config.port;
    this.webhookUrl = config.webhookUrl;
    this.handleRequest = config.handleRequest;
    this.isServerStarted = false;

    debug(`create server on: ${this.port}, ${this.webhookUrl}`);
    this.server = http.createServer(
      async (request: http.ServerRequest, response: http.ServerResponse) => {
        const body: Array<string | Buffer> = [];
        request
          .on('data', chunk => {
            body.push(chunk);
          })
          .on('end', async () => {
            const requestData = Buffer.from(body).toString();
            if (request.method !== 'POST' || request.url !== this.webhookUrl) {
              response.statusCode = 400;
              return response.end();
            }
            const requestBody = JSON.parse(requestData);
            const responseBody = await this.handleRequest(requestBody);
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(responseBody));
          });
      },
    );
    return this;
  }

  public start(): void {
    if (this.isServerStarted) {
      throw new Error(`Server is already started`);
    }
    this.server.listen(this.port, () => {
      debug(`server is listening on ${this.port}, '${this.webhookUrl}'`);
      this.isServerStarted = true;
    });
  }

  public stop(): void {
    if (this.isServerStarted) {
      debug(`stopping webhook server`);
      this.server.close();
      this.isServerStarted = false;
    }
  }
}
