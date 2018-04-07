const Alice = require('../alice')
const { generateRequest } = require('./testUtils')


// Test for matching all command types

test('matching with string', async (done) => {
  const alice = new Alice()

  alice.command('привки', ctx => done())
  alice.handleRequestBody(generateRequest('Привет, как дела?'))
})

test('matching with array', async(done) => {
  const alice = new Alice()

  alice.command(['привки', 'как'], ctx => done())
  alice.handleRequestBody(generateRequest('Привет, как дела?'))
})

test('matching with regexp', async (done) => {
  const alice = new Alice()

  alice.command(/[а-яё]+/i, ctx => done())
  alice.handleRequestBody(generateRequest('Привет как дела'))
})

test('priority check, strings over regexps', async (done) => {
  const alice = new Alice()

  alice.command(/[а-яё]+/i, ctx => new Error('Error has occured'))
  alice.command('привет', ctx => done())
  alice.handleRequestBody(generateRequest('Привет как дела'))
})

test('listenining on port with callback', async (done) => {
  const alice = new Alice()
  alice.listen('/', 3000, () => {
    alice.stopListening()
    done()
  })
})

test('listening on port with promise', async (done) => {
  const alice = new Alice()
  alice.listen('/', 3000).then(() => {
    alice.stopListening()
    done()
  })
})
