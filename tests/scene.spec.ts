import { Alice, Scene, Stage, sessionMiddleware, Reply } from '../dist/';
import { request, getRandomText, delay } from './testUtils';

describe('alice scenes', () => {
  let alice = null;
  let stage = null;
  let randomText = '';
  beforeEach(() => {
    alice = new Alice();
    stage = new Stage();
    randomText = getRandomText();
  });

  test('create new scene', async done => {
    const scene = new Scene('bar');
    scene.any(ctx => ({ text: randomText }));
    stage.addScene(scene);
    // alice.use(sessionMiddleware());
    alice.use(stage.getMiddleware());
    alice.any(async ctx => {
      ctx.enter('bar');
      return { text: 'foo' };
    });
    // handling first request, leading to the scene "bar"
    let data = await alice.handleRequest(request('hey!'));
    expect(data.response.text).toBe('foo');
    // now looking for an answer from scene
    data = await alice.handleRequest(request('hey!'));
    expect(data.response.text).toBe(randomText);
    done();
  });

  test('switch between scenes', async done => {
    const scene1 = new Scene('1');
    scene1.any(ctx => {
      ctx.enter('2');
      return { text: 'scene1' };
    });
    const scene2 = new Scene('2');
    scene2.any(async ctx => {
      ctx.leave();
      return { text: 'scene2' };
    });
    stage.addScene(scene1);
    stage.addScene(scene2);
    alice.use(stage.getMiddleware());
    alice.any(async ctx => {
      ctx.enter('1');
      return { text: 'alice' };
    });
    let data = await alice.handleRequest(request('baz'));
    expect(data.response.text).toBe('alice');
    done();
    data = await alice.handleRequest(request('.'));
    expect(data.response.text).toBe('scene1');
    data = await alice.handleRequest(request('.'));
    expect(data.response.text).toBe('scene2');
    data = await alice.handleRequest(request('.'));
    expect(data.response.text).toBe('alice');
  });
});
