module.exports = {
  extends: 'standard',
  parser: 'typescript-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    } 
  },
  rules: {
    'no-return-await': 0,
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }]
  }
}
