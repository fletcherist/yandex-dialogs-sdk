const { reversedInterpolation } = require('../utils')

test('interpolation execution', () => {
  const template = 'Alice, i want to by ${what} for ${price} and'
  const string = 'Alice, i want to by Apple for smth and'
  const expected = { what: 'Apple', price: 'smth' }
  expect(reversedInterpolation(template, string)).toEqual(expected)
})