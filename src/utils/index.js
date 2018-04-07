const formatToken = token => token
  .replace('$', '')
  .replace('{', '')
  .replace('}', '')

const MATCH_REGEX = /\${([a-z0-9]+)}/gi
const SEARCH_REGEX_STR = '(.*)'

function extractTemplateTokenNames(template) {
  const matchedTokens = template.match(MATCH_REGEX).map(formatToken)
  const tokensObject = {}
  matchedTokens.forEach((token, index) => tokensObject[token] = index)
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

module.exports.selectCommand = req => req.request.command
module.exports.selectSession = req => req.session
module.exports.selectSessionId = req => selectSession(req).session_id
module.exports.selectUserId = req => selectSession(req).user_id
module.exports.isFunction = fn => fn && typeof fn === 'function'
