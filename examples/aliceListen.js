const Alice = require('../src/index')
const alice = new Alice()

alice.command('архангельск', async (ctx) => {
  console.log(ctx)
  return ctx.reply('блять чё ха хуня')
})

alice.any(async (ctx) => {
  return ctx.reply('Вы из англии?')
})

alice.listen('/', 8080)