import { Alice, Scene } from '../dist/';
import { request, getRandomText } from './testUtils';

describe('alice module', () => {
  let alice = null;
  let randomText = '';
  beforeEach(() => {
    alice = new Alice();
    randomText = getRandomText();
  });

  test('listening on port & stop listening', async done => {
    const server = alice.listen(8123, '/');
    setTimeout(() => {
      server.stop();
      done();
    }, 0);
  });

  test('any command', async () => {
    alice.any(ctx => ({ text: randomText }));
    const data = await alice.handleRequest(request('ping'));
    expect(data.response.text).toBe(randomText);
  });

  test('text command', async () => {
    alice.command('foo bar', ctx => ({ text: randomText }));
    const data = await alice.handleRequest(request('foo bar'));
    expect(data.response.text).toBe(randomText);
  });

  test('regex command', async () => {
    alice.command(/foo/, ctx => ({ text: randomText }));
    const data = await alice.handleRequest(request('foo bar'));
    expect(data.response.text).toBe(randomText);
  });

  test('text array command', async () => {
    alice.command(['foo', 'foo bar'], ctx => ({ text: randomText }));
    const data = await alice.handleRequest(request('foo bar'));
    expect(data.response.text).toBe(randomText);
  });

  test('matcher command', async () => {
    alice.command(ctx => true, ctx => ({ text: randomText }));
    const data = await alice.handleRequest(request('foo bar'));
    expect(data.response.text).toBe(randomText);
  });
});
