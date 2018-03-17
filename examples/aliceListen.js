const Alice = require('../src/index')
const alice = new Alice()

alice.command('архангельск', async (ctx) => {
  return ctx.reply('asasdad')
})

alice.listen('/', 8080)