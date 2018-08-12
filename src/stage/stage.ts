import { IScene } from './scene';
import { Middleware, IMiddlewareResult } from '../middleware/middleware';
import { ISessionContext } from '../session/sessionContext';
import { IStageContext } from './stageContext';
import { StageСompere } from './compere';

export interface IStage {
  addScene(scene: IScene): void;
  removeScene(name: string): void;

  getMiddleware(): Middleware;
}

export class Stage implements IStage {
  public static readonly DEFAULT_SCENE_NAME = '__mainScene';
  public static readonly CURRENT_SCENE_SESSION_KEY = '__currentScene';

  private readonly _scenes: Map<string, IScene>;

  constructor() {
    this._scenes = new Map<string, IScene>();
  }

  public addScene(scene: IScene): void {
    if (this._scenes.has(scene.name)) {
      throw new Error(`Duplicate scene name ${scene.name}`);
    }
    this._scenes.set(scene.name, scene);
  }

  public removeScene(name: string): void {
    if (!this._scenes.has(name)) {
      throw new Error(`No scene with name ${name}`);
    }
    this._scenes.delete(name);
  }

  public getMiddleware(): Middleware<ISessionContext> {
    return async (context, next): Promise<IMiddlewareResult> => {
      if (!context.session) {
        throw new Error(
          'You have to add some session middelware to use scenes',
        );
      }
      const sceneName =
        context.session.get(Stage.CURRENT_SCENE_SESSION_KEY) ||
        Stage.DEFAULT_SCENE_NAME;
      const scene = this._scenes.has(sceneName)
        ? this._scenes.get(sceneName)
        : this._scenes.has(Stage.DEFAULT_SCENE_NAME)
          ? this._scenes.get(sceneName)
          : null;
      if (scene) {
        const stageContext: IStageContext = {
          ...context,
          compere: new StageСompere(context),
        };
        const result = await scene.run(stageContext);
        return {
          responseBody: result,
        };
      }

      return next ? next(context) : null;
    };
  }
}
