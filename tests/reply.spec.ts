import { Reply } from '../dist';
import { getRandomText } from './testUtils';

describe('Alice Reply (static method) suite', () => {
  let text = '';
  beforeEach(() => {
    text = getRandomText();
  });
  test('Text reply', () => {
    expect(Reply.text(text)).toEqual({
      text: text,
      tts: text,
      end_session: false,
    });
  });
  test('Text reply with extra params', () => {
    const expected = {
      text: text,
      tts: text + '+',
      end_session: true,
    };
    expect(
      Reply.text(expected.text, { tts: expected.tts, end_session: true }),
    ).toEqual({
      text: text,
      tts: expected.tts,
      end_session: true,
    });
  });
});
