import { Reply, Markup } from '../dist';
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
      tts: `${text}+`,
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
  test('BigImage Card reply', () => {
    const expected = {
      text: 'text',
      tts: 'text',
      card: {
        type: 'BigImage',
        image_id: '1',
        title: 'title',
        description: 'description',
      },
      end_session: false,
    };
    const reply = Reply.bigImageCard(expected.text, {
      image_id: expected.card.image_id,
      title: expected.card.title,
      description: expected.card.description,
    });
    expect(reply).toEqual(expected);
  });

  test('ItemsList Card reply with array', () => {
    const expected = {
      text: 'text',
      tts: 'text',
      card: {
        type: 'ItemsList',
        items: [
          {
            image_id: '1',
            title: 'title',
            description: 'description',
          },
          {
            image_id: '1',
            title: 'title',
            description: 'description',
          },
        ],
      },
      end_session: false,
    };
    const reply = Reply.itemsListCard(expected.text, expected.card.items);
    expect(reply).toEqual(expected);
    const reply2 = Reply.itemsListCard(expected.text, expected.card);
    expect(reply2).toEqual(expected);
  });
});

describe('Markup suite', () => {
  test('Markup button with text constructor', () => {
    const expected = {
      title: 'foo',
      payload: {
        title: 'foo',
      },
    };
    const button = Markup.button(expected.title);
    expect(button).toEqual(expected);
  });

  test('Markup button with object constructor', () => {
    const expected = {
      title: 'foo',
      hide: true,
      url: '',
      payload: {
        title: 'foo',
      },
    };
    const button = Markup.button(expected);
    expect(button).toEqual(expected);
  });
});
