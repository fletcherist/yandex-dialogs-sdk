const generateRequest = (commandText, utteranceText) => ({
  'meta': {
    'client_id': 'Developer Console',
    'locale': 'ru-RU',
    'timezone': 'UTC'
  },
  'request': {
    'command': commandText,
    'original_utterance': utteranceText || commandText,
    'type': 'SimpleUtterance'
  },
  'session': {
    'message_id': 0,
    'new': true
  },
  'version': '1.0'
})

module.exports.generateRequest = generateRequest
