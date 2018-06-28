const formatToken = token => token
  .replace('$', '')
  .replace('{', '')
  .replace('}', '')

const MATCH_REGEX = /\${([a-z0-9]+)}/gi
const SEARCH_REGEX_STR = '(.*)'

function extractTemplateTokenNames(template) {
  const matchedTokens = template.match(MATCH_REGEX).map(formatToken)
  const tokensObject = {}
  matchedTokens.forEach((token, index) => { tokensObject[token] = index })
  return tokensObject
}

function searchFiguresInString(template, string) {
  const searchTemplate = template.replace(MATCH_REGEX, SEARCH_REGEX_STR)
  const searchTemplateRegex = new RegExp(searchTemplate, 'ig')
  const matched = searchTemplateRegex.exec(string)
  return matched.filter(Boolean).slice(1)
}

function connectTokensWithFigures(tokens, figures) {
  const res = {}
  for (let token in tokens) {
    res[token] = figures[tokens[token]] || null
  }
  return res
}

function reversedInterpolation(template, string) {
  if (!template) throw new Error('No template provided')
  if (!string) throw new Error('No string provided')
  const tokens = extractTemplateTokenNames(template)
  const figures = searchFiguresInString(template, string)
  return connectTokensWithFigures(tokens, figures)
}

module.exports.reversedInterpolation = reversedInterpolation

const selectCommand = req => req.request.command
const selectSession = req => req.session
const selectSessionId = req => selectSession(req).session_id
const selectUserId = req => selectSession(req).user_id
const isFunction = fn => fn && typeof fn === 'function'

module.exports.selectCommand = selectCommand
module.exports.selectSession = selectSession
module.exports.selectSessionId = selectSessionId
module.exports.selectUserId = selectUserId
module.exports.isFunction = isFunction
