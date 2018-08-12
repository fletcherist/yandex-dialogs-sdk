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

  public enter(name: string): void {
    this._context.session.set(Stage.CURRENT_SCENE_SESSION_KEY, name);
  }

  public leave(): void {
    this._context.session.set(
      Stage.CURRENT_SCENE_SESSION_KEY,
      Stage.DEFAULT_SCENE_NAME,
    );
  }
}
