import { IApiRequest } from './api/request';
import { IApiRequestNlu } from './api/nlu';
import { IApiResponseBody } from './api/response';

export interface IContext {
  readonly data: IApiRequest;
  readonly message: string;
  readonly originalUtterance: string;
  readonly sessionId: string;
  readonly messageId: number;
  readonly userId: string;
  readonly payload?: object;
  readonly nlu?: IApiRequestNlu;
  // param response appears in context when all
  // middlewares have been done and we got some response
  response?: IApiResponseBody;
}
