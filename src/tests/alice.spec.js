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

// Test for matching all command types

test('matching with string', async(done) => {
  const alice = new Alice()

  alice.command('привки', ctx => done())
  alice.handleRequestBody(generateRequest('Привет, как дела?'))
})

test('matching with array', async(done) => {
  const alice = new Alice()
  
  alice.command(['привки', 'как'], ctx => done())
  alice.handleRequestBody(generateRequest('Привет, как дела?'))
})

test('matching with regexp', async(done) => {
  const alice = new Alice()
  
  alice.command(/[а-яё]+/i, ctx => done())
  alice.handleRequestBody(generateRequest('Привет как дела'))
})

test('priority check, strings over regexps', async(done) => {
  const alice = new Alice()
  
  alice.command(/[а-яё]+/i, ctx => new Error('Error has occured'))
  alice.command('привет', ctx => done())
  alice.handleRequestBody(generateRequest('Привет как дела'))
})

test('listenining on port with callback', async(done) => {
  const alice = new Alice()
  alice.listen('/', 3000, () => done())
})

test('listening on port with promise', async(done) => {
  const alice = new Alice()
  alice.listen('/', 3001).then(() => done())
})