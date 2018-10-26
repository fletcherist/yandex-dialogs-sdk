import { Alice, Scene, Stage, Reply, IStageContext } from '../src/index';
import { createTextRequest } from './utils/request';
import { generateRandomText } from './utils/text';

describe('alice scenes', () => {
  let alice: Alice;
  let stage: Stage;
  let randomText = '';
  beforeEach(() => {
    alice = new Alice();
    stage = new Stage();
    randomText = generateRandomText();
  });

  test('create new scene', async done => {
    const scene = new Scene('bar');
    scene.any(ctx => Reply.text(randomText));
    stage.addScene(scene);
    // alice.use(sessionMiddleware());
    alice.use(stage.getMiddleware());
    alice.any(async ctx => {
      // TODO (yavanosta): get rid of this "as".
      (ctx as IStageContext).enter('bar');
      return Reply.text('foo');
    });
    // handling first request, leading to the scene "bar"
    let data = await alice.handleRequest(createTextRequest('hey!'));
    expect(data.response.text).toBe('foo');
    // now looking for an answer from scene
    data = await alice.handleRequest(createTextRequest('hey!'));
    expect(data.response.text).toBe(randomText);
    done();
  });

  test('switch between scenes', async done => {
    const scene1 = new Scene('1');
    scene1.any(ctx => {
      ctx.enter('2');
      return Reply.text('scene1');
    });
    const scene2 = new Scene('2');
    scene2.any(async ctx => {
      ctx.leave();
      return Reply.text('scene2');
    });
    stage.addScene(scene1);
    stage.addScene(scene2);
    alice.use(stage.getMiddleware());
    alice.any(async ctx => {
      // TODO (yavanosta): get rid of this "as".
      (ctx as IStageContext).enter('1');
      return Reply.text('alice');
    });
    let data = await alice.handleRequest(createTextRequest('baz'));
    expect(data.response.text).toBe('alice');
    done();
    data = await alice.handleRequest(createTextRequest('.'));
    expect(data.response.text).toBe('scene1');
    data = await alice.handleRequest(createTextRequest('.'));
    expect(data.response.text).toBe('scene2');
    data = await alice.handleRequest(createTextRequest('.'));
    expect(data.response.text).toBe('alice');
  });
});
