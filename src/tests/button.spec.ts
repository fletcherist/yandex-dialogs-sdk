
import button from '../button'
import ButtonBuilder from '../buttonBuilder'

test('create button with string constructor', () => {
  const expected = {
    title: 'send message',
  }
  const btn = button(expected.title)
  expect(btn).toEqual(expected)
})

test('create button with object constructor', () => {
  const expected = {
    title: 'show messages',
    payload: { test: 'test' },
    hide: true,
  }
  const btn = button({
    title: expected.title,
    payload: expected.payload,
    hide: expected.hide,
  })

  const btn2 = new ButtonBuilder()
    .title(expected.title)
    .payload(expected.payload)
    .shouldHide(expected.hide)
    .get()

  expect(btn).toEqual(expected)
  expect(btn2).toEqual(expected)
})

