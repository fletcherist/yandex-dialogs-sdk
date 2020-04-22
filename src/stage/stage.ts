import { Scene } from './scene';
import { Middleware } from '../middleware/middleware';
import { SessionContext } from '../session/sessionContext';
import { StageContext } from './stageContext';
import { StageCompere } from './compere';
import { CURRENT_SCENE_SESSION_KEY, DEFAULT_SCENE_NAME } from './constants';
import debug from '../debug';

export class Stage implements Stage {
  private readonly _scenes: Map<string, Scene>;

  constructor() {
    this._scenes = new Map<string, Scene>();
  }

  public addScene(scene: Scene): void {
    if (!(scene instanceof Scene)) {
      throw new Error(
        'Incorrect argument scene. Please provide Scene instance',
      );
    }
    if (this._scenes.has(scene.name)) {
      throw new Error(`Duplicate scene name "${scene.name}"`);
    }
    this._scenes.set(scene.name, scene);
    debug(`scene added "${scene.name}"`);
  }

  public removeScene(name: string): void {
    if (!this._scenes.has(name)) {
      throw new Error(`No scene with name "${name}"`);
    }
    this._scenes.delete(name);
    debug(`scene removed "${name}"`);
  }

  public getMiddleware(): Middleware<SessionContext> {
    return async (context, next): Promise<SessionContext> => {
      if (!context.session) {
        throw new Error(
          'You have to add some session middelware to use scenes',
        );
      }
      const sceneName =
        (await context.session.get(CURRENT_SCENE_SESSION_KEY)) ||
        DEFAULT_SCENE_NAME;
      const scene = this._scenes.has(sceneName)
        ? this._scenes.get(sceneName)
        : this._scenes.has(DEFAULT_SCENE_NAME)
        ? this._scenes.get(DEFAULT_SCENE_NAME)
        : null;
      if (!scene) {
        return next ? next(context) : context;
      }

      const compere = new StageCompere(context);
      const stageContext: StageContext = {
        ...context,
        enter: (name: string) => compere.enter(name),
        leave: () => compere.leave(),
      };
      const result = await scene.run(stageContext);
      if (!result) {
        return next ? next(stageContext) : stageContext;
      }

      stageContext.response = result;
      return stageContext;
    };
  }
}
