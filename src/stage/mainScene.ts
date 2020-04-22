import { Stage } from './stage';
import { Scene } from './scene';
import { Middleware } from '../middleware/middleware';
import { DEFAULT_SCENE_NAME } from './constants';

export class MainStage {
  public scene: Scene;
  public stage: Stage;
  public middleware: Middleware;

  constructor() {
    this.stage = new Stage();
    this.scene = new Scene(DEFAULT_SCENE_NAME);
    this.stage.addScene(this.scene);
    this.middleware = this.stage.getMiddleware();
  }
}
