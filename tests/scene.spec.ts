import { Alice, Scene, Stage } from '../dist/';
import { request, getRandomText } from './testUtils';

describe('alice scenes', () => {
  let alice = null;
  let randomText = '';
  let stage = null;
  beforeEach(() => {
    alice = new Alice();
    randomText = getRandomText();
    stage = new Stage();
  });

  test('create new scene', () => {
    const scene = new Scene('name');
    stage.addScene(scene);
    alice.use(stage.getMiddleware());
  });
});
