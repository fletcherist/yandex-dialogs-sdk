const Alice = require('../src/index')
const alice = new Alice()

alice.command('архангельск', async (ctx) => {
  console.log(ctx)
  return ctx.reply('asasdad')
})

alice.any(async (ctx) => {
  
})

alice.listen('/', 8080)