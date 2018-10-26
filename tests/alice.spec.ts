import { Alice, Reply } from '../src/index';
import { createTextRequest } from './utils/request';
import { generateRandomText } from './utils/text';

describe('alice module', () => {
  let alice: Alice;
  let randomText: string = '';
  beforeEach(() => {
    alice = new Alice();
    randomText = generateRandomText();
  });

  test('listening on port & stop listening', async done => {
    const server = alice.listen(8123, '/');
    setTimeout(() => {
      server.stop();
      done();
    }, 0);
  });

  test('any command', async () => {
    alice.any(ctx => Reply.text(randomText));
    const data = await alice.handleRequest(createTextRequest('ping'));
    expect(data.response.text).toBe(randomText);
  });

  test('text command', async () => {
    alice.command('foo bar', ctx => Reply.text(randomText));
    const data = await alice.handleRequest(createTextRequest('foo bar'));
    expect(data.response.text).toBe(randomText);
  });

  test('regex command', async () => {
    alice.command(/foo/, ctx => Reply.text(randomText));
    const data = await alice.handleRequest(createTextRequest('foo bar'));
    expect(data.response.text).toBe(randomText);
  });

  test('text array command', async () => {
    alice.command(['foo', 'foo bar'], ctx => Reply.text(randomText));
    const data = await alice.handleRequest(createTextRequest('foo bar'));
    expect(data.response.text).toBe(randomText);
  });

  test('matcher command', async () => {
    alice.command(ctx => true, ctx => Reply.text(randomText));
    const data = await alice.handleRequest(createTextRequest('foo bar'));
    expect(data.response.text).toBe(randomText);
  });
});
