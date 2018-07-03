import Alice from '../alice'
import { generateRequest } from './testUtils'

// Test for matching all command types

test('matching with string', async (done) => {
  const alice = new Alice()

  alice.command('Привет, как дела', (ctx) => done())
  alice.handleRequest(generateRequest('Привет, как дела?'))
})

test('matching with array', async (done) => {
  const alice = new Alice()

  alice.command(['привет', 'как дела'], (ctx) => done())
  alice.handleRequest(generateRequest('Привет, как дела?'))
})

test('matching with regexp', async (done) => {
  const alice = new Alice()

  alice.command(/[а-яё]+/i, (ctx) => done())
  alice.handleRequest(generateRequest('Привет как дела'))
})

test('priority check, strings over regexps', async (done) => {
  const alice = new Alice()

  alice.command(/[а-яё]+/i, (ctx) => new Error('Error has occured'))
  alice.command('привет', (ctx) => done())
  alice.handleRequest(generateRequest('Привет как дела'))
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

test('ctx body', async (done) => {
  const alice = new Alice()
  alice.command('забронируй встречу в ${where} на ${when}', (ctx) => {
    /*
     * Context body parses message and extract phrases
     * in brackets!
     */
    expect(ctx.body).toEqual({
      where: '7-холмов',
      when: '18:00',
    })
    done()
  })
  alice.handleRequest(
    generateRequest('забронируй встречу в 7-холмов на 18:00'),
  )
})
