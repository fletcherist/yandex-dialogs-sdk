const Scene = require('../scene')

test('creating scene with name', () => {
  const scene = new Scene('testName')
  expect(scene.name).toBe('testName')
})
