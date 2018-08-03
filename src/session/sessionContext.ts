import { IContext } from "../context";
import { ISession } from "./session";

export interface ISessionContext extends IContext {
  readonly session: ISession,
}
