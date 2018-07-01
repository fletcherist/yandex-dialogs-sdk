const Alice = require('../dist/index')
const alice = new Alice()

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
