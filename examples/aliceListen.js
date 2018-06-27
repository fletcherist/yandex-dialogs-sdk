const Alice = require('../src/index')
const alice = new Alice()

alice.first(async (ctx) => {
  return ctx.reply('Привет! Смотри, что я могу')
})

alice.command('дай совет', async (ctx) => {
  return ctx.reply('Make const not var')
})

alice.any(async (ctx) => {
  return ctx.reply('О чём это вы?')
})

alice.listen('/', 8080)