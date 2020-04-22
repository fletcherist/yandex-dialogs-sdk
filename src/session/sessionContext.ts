import { Context } from '../context';
import { Session } from './session';

export interface SessionContext extends Context {
  readonly session: Session;
}
