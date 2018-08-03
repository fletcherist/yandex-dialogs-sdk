import { ISessionContext } from '../session/sessionContext';
import { Stage } from './stage';

export interface IStageСompere {
  enter(name: string): void;
  leave(): void;
}

export class StageСompere implements IStageСompere {
  private readonly _context: ISessionContext;

  constructor(context: ISessionContext) {
    this._context = context;
  }

  enter(name: string): void {
    this._context.session.set(Stage.CURRENT_SCENE_SESSION_KEY, name);
  }

  leave(): void {
    this._context.session.delete(Stage.CURRENT_SCENE_SESSION_KEY);
  }
}
