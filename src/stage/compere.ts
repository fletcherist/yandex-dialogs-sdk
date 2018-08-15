import { ISessionContext } from '../session/sessionContext';
import { Stage } from './stage';
import debug from '../debug';

export interface IStageCompere {
  enter(name: string): void;
  leave(): void;
}

export class StageCompere implements IStageCompere {
  private readonly _context: ISessionContext;

  constructor(context: ISessionContext) {
    this._context = context;
  }

  public enter(name: string): void {
    this._context.session.set(Stage.CURRENT_SCENE_SESSION_KEY, name);
    debug(`scene changed for: ${name}`);
  }

  public leave(): void {
    this._context.session.set(
      Stage.CURRENT_SCENE_SESSION_KEY,
      Stage.DEFAULT_SCENE_NAME,
    );
    debug(`scene changed for: ${Stage.DEFAULT_SCENE_NAME}`);
  }
}
