import { StageCompere } from './compere';
import { SessionContext } from '../session/sessionContext';

export interface StageContext extends SessionContext {
  readonly enter: StageCompere['enter'];
  readonly leave: StageCompere['leave'];
}
