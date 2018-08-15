import { IApiRequest } from './api/request';

export interface IContext {
  readonly data: IApiRequest;
  readonly message: string;
  readonly originalUtterance: string;
  readonly sessionId: string;
  readonly messageId: number;
  readonly userId: string;
  readonly payload: object | undefined;
}
