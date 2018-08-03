import { IStageСompere } from "./compere";
import { ISessionContext } from "../session/sessionContext";

export interface IStageContext extends ISessionContext {
  readonly compere: IStageСompere,
}
