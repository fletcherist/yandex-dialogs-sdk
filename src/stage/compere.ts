import { SessionContext } from '../session/sessionContext';
import { CURRENT_SCENE_SESSION_KEY, DEFAULT_SCENE_NAME } from './constants';
import debug from '../debug';

export class StageCompere {
  private readonly _context: SessionContext;

  constructor(context: SessionContext) {
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
