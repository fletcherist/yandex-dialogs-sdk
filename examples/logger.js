const Alice = require('../dist/index')
const alice = new Alice()

const { loggingMiddleware } = Alice

alice.use(loggingMiddleware({
  level: 1 // Optional. DEFAULT 0. see https://github.com/pimterry/loglevel
}))

/* Output:
 *
 * [21:33:12] INFO root: {messageRecieved} дай совет!
 * [21:33:12] INFO root: {messageSent} Make const not var
 */

alice.welcome(async (ctx) => {
  ctx.reply('Привет! Смотри, что я могу')
})

alice.command('дай совет', async (ctx) => {
  ctx.reply('Make const not var')
})

alice.any(async (ctx) => {
  ctx.reply('О чём это вы?')
})

alice.listen('/', 8080)
