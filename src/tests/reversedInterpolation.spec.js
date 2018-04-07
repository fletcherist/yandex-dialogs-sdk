const { reversedInterpolation } = require('../utils')

test('interpolation execution', () => {
  const template = 'Alice, i want to by ${what} for ${price} and'
  const string = 'Alice, i want to by Apple for smth and'
  console.log(reversedInterpolation(template, string))
})