const button = require('../button')

test('create button with string constructor', () => {
  const expected = {
    title: 'send message'
  }
  const btn = button(expected.title)
  expect(btn).toEqual(expected)
})

test('create button with object constructor', () => {
  const expected = {
    title: 'show messages',
    payload: { test: 'test' },
    hide: true
  }
  const btn = button({
    title: expected.title,
    payload: expected.payload,
    hide: expected.hide
  })
  expect(btn).toEqual(expected)
})