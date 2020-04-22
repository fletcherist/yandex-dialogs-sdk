import { IStageCompere } from './compere';
import { SessionContext } from '../session/sessionContext';

export interface StageContext extends SessionContext {
  readonly enter: IStageCompere['enter'];
  readonly leave: IStageCompere['leave'];
}
