import Alice from '../alice';
import Scene from '../scene';
import { generateRequest } from './testUtils';

test('creating scene with name', () => {
  const scene = new Scene('testName');
  expect(scene.name).toBe('testName');
});

test('registering an array of scenes', () => {
  const alice = new Alice();
  const scene1 = new Scene('scene1');
  const scene2 = new Scene('scene2');

  alice.registerScene([scene1, scene2]);

  // yup it's a private method but who cares whatsoever?..
  expect(alice.scenes.length).toBe(2);
});

test('register scene and enter in', async () => {
  const alice = new Alice();
  const scene = new Scene('123');
  scene.enter('1', ctx => ctx.reply('enter'));
  scene.any(ctx => ctx.reply('scene-any'));
  scene.command('3', ctx => ctx.reply('command'));
  scene.leave('2', ctx => ctx.reply('leave'));

  alice.registerScene(scene);
  alice.any(ctx => ctx.reply('hi'));

  let res;
  res = await alice.handleRequest(generateRequest('hello'));
  expect(res.response.text).toBe('hi');

  res = await alice.handleRequest(generateRequest('1'));
  expect(res.response.text).toBe('enter');
  res = await alice.handleRequest(generateRequest('blablabla'));
  expect(res.response.text).toBe('scene-any');

  res = await alice.handleRequest(generateRequest('2'));
  expect(res.response.text).toBe('leave');
});

test('changing scene', async () => {
  const alice = new Alice();
  const scene1 = new Scene('scene1');
  const scene2 = new Scene('scene2');
  scene1.enter('keyword', ctx => {
    ctx.enterScene(scene2);
    return ctx.reply('scene1');
  });
  scene2.any(ctx => {
    ctx.leaveScene();
    return ctx.reply('scene2');
  });

  alice.registerScene([scene1, scene2]);
  alice.any(ctx => ctx.reply('main'));

  let data;
  data = await alice.handleRequest(generateRequest('hello'));
  expect(data.response.text).toBe('main');
  // Test scene1 change scene method (ctx.enterScene)
  data = await alice.handleRequest(generateRequest('keyword'));
  expect(data.response.text).toBe('scene1');
  // Test scene2 leave method
  data = await alice.handleRequest(generateRequest('hello'));
  expect(data.response.text).toBe('scene2');
  data = await alice.handleRequest(generateRequest('hello'));
  expect(data.response.text).toBe('main');
});
