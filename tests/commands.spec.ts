// Module test for commands class
import Commands from '../commands';

test('adding a command', () => {
  const commands = new Commands();

  // Testing a string command
  const cb = ctx => 'test';

  commands.add('Привет, алиса!', cb);
  expect(commands.length).toBe(1);
});
