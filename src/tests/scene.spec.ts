import Alice from '../alice';

const Scene = require('../scene')

test('creating scene with name', () => {
  const scene = new Scene('testName')
  expect(scene.name).toBe('testName')
})

test('registering an array of scenes', () => {
  const alice = new Alice()
  const scene1 = new Scene('scene1')
  const scene2 = new Scene('scene2')

  alice.registerScene([scene1, scene2])

  // yup it's a private method but who cares whatsoever?..
  expect(alice.scenes.length).toBe(2)
})

