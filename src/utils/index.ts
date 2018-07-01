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
  const searchTemplateRegex = getFiguresRegexp(template)
  const matched = searchTemplateRegex.exec(string)
  return matched.filter(Boolean).slice(1)
}

function getFiguresRegexp(figure) {
  const searchTemplate = figure.replace(MATCH_REGEX, SEARCH_REGEX_STR)
  return new RegExp(searchTemplate, 'ig')
}

function connectTokensWithFigures(tokens, figures) {
  const res = {}
  for (let token in tokens) {
    res[token] = figures[tokens[token]] || null
  }
  return res
}

function reversedInterpolation(template: string, string: string) {
  if (!template) throw new Error('No template provided')
  if (!string) throw new Error('No string provided')
  const tokens = extractTemplateTokenNames(template)
  const figures = searchFiguresInString(template, string)
  return connectTokensWithFigures(tokens, figures)
}

const selectCommand = req => req.request.command
const selectSession = req => req.session
const selectSessionId = req => selectSession(req).session_id
const selectUserId = req => selectSession(req).user_id
const isFunction = (fn: Function) => fn && typeof fn === 'function'

export {
  getFiguresRegexp,
  selectCommand,
  selectSession,
  selectSessionId,
  selectUserId,
  isFunction,
  reversedInterpolation
}
