const Alice = require('yandex-dialogs-sdk')
const alice = new Alice()

alice.command('дай совет', async (ctx) => {
  return ctx.reply('Make const not var')
})

alice.any(async (ctx) => {
  return ctx.reply('О чём это вы?')
})

alice.listen('/', 80)