const Alice = require('../dist/index')
const alice = new Alice()

const aliceCorsMiddleware = (params) => {
  return ctx => {
    if (ctx.server) {
      ctx.server.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        next()
      })
    }
  }
}
// now all requests will be answered with
// with cors headers
alice.use(aliceCorsMiddleware())

// Example for pure strings #1
alice.command('дай совет', async (ctx) => {
  ctx.reply('Make const not var')
})

const port = 8080
alice.listen('/', port).then(console.log('listening on:', port))
