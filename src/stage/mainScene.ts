import { Stage, IStage } from './stage';
import { Scene, IScene } from './scene';
import { Middleware } from '../middleware/middleware';

export class MainStage {
  public scene: IScene;
  public stage: IStage;
  public middleware: Middleware;

  constructor() {
    this.stage = new Stage();
    this.scene = new Scene(Stage.DEFAULT_SCENE_NAME);
    this.stage.addScene(this.scene);
    this.middleware = this.stage.getMiddleware();
  }
}
