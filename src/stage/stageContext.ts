import { IStageCompere } from './compere';
import { ISessionContext } from '../session/sessionContext';

export interface IStageContext extends ISessionContext {
  readonly enter: IStageCompere['enter'];
  readonly leave: IStageCompere['leave'];
}
