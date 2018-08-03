import { IApiRequest } from "./api/request";

export interface IContext {
  readonly data: IApiRequest,
}
