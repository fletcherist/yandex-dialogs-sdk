import { IApiRequest } from './api/request';
import { IApiRequestNlu } from './api/nlu'

export interface IContext {
  readonly data: IApiRequest;
  readonly message: string;
  readonly originalUtterance: string;
  readonly sessionId: string;
  readonly messageId: number;
  readonly userId: string;
  readonly payload: object | undefined;
  readonly nlu: IApiRequestNlu
}
