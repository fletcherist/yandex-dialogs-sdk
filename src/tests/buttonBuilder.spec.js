const ButtonBuilder = require('../buttonBuilder')

test('common test for buttonBuilder', () => {
  const expected = {
    title: 'Some button text',
    url: 'https://example.com',
    hide: true,
    payload: {
      some: 'data'
    }
  }

  const button = new ButtonBuilder()

  // test using button builder factory
  button
    .text(expected.title)
    .url(expected.url)
    .shouldHide(expected.hide)
    .payload(expected.payload)

  expect(button.get()).toEqual(expected)

  // test using button builder constructor

  const button2 = new ButtonBuilder(expected)
  expect(button2).toEqual(expected)
})
