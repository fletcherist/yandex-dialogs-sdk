import { ISessionContext } from '../session/sessionContext';
import { CURRENT_SCENE_SESSION_KEY, DEFAULT_SCENE_NAME } from './constants';
import debug from '../debug';

export interface IStageCompere {
  enter(name: string): Promise<void>;
  leave(): Promise<void>;
}

export class StageCompere implements IStageCompere {
  private readonly _context: ISessionContext;

  constructor(context: ISessionContext) {
    this._context = context;
  }

  public async enter(name: string): Promise<void> {
    await this._context.session.set(CURRENT_SCENE_SESSION_KEY, name);
    debug(`scene changed for: ${name}`);
  }

  public async leave(): Promise<void> {
    await this._context.session.set(
      CURRENT_SCENE_SESSION_KEY,
      DEFAULT_SCENE_NAME,
    );
    debug(`scene changed for: ${DEFAULT_SCENE_NAME}`);
  }
}
