const button = require('../button')

test('create button with string constructor', () => {
  const expected = {
    title: 'Прочитать сообщение'
  }
  const btn = button(expected.title)
  expect(btn).toEqual(expected)
})