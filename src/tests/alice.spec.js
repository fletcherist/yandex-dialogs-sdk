const Alice = require('../alice')

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

test('common test for alice', async(done) => {
  const alice = new Alice()
  
  // register commands to match the request to
  alice.command('привки', ctx => done())

  // test matches
  alice.handleRequestBody(generateRequest('Привет, как дела?'))
})