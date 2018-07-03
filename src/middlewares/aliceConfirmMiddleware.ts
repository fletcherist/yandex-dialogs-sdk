
// import Ctx from '../ctx'

// alice.welcome((ctx) => {
//   ctx.confirm({
//     reply: '18 есть?',
//     onYes: (ctx) => ctx.confirm({
//       reply: 'А вы уверены?',
//       onYes: (ctx) => ctx.reply('добро пожаловать'),
//     }),
//     onNo: (ctx) => {ctx.reply('в другой раз'),
//   })
// })

// ctx.confirm(
//   '18 есть',
//   (ctx) => ctx.reply('good'),
//   (ctx) => ctx.reply('bad'),
// )

import reply from '../reply'
// [WIP]
function aliceConfirmMiddleware() {
  const store = new Map()
  return (ctx) => {
    Object.defineProperty(ctx, 'confirm', (
      message: string,
      onYesCallback: () => void,
      onNoCallback: () => void,
    ) => {
      const params = {}
      if (typeof params === 'string') {
        // confirmParams =

        store.set(ctx.sessionId, {
          onYesCallback,
          onNoCallback,
        })
      }
      const responseMessage = reply(message)
      ctx.reply(responseMessage)
    })
    }

    // const data = store.get(ctx.sessionId)
    // if (data) {
    //   if (ctx.req.payload === data.yes) { }) {
    //     return data.onYes()
    //   } else {
    //     return data.onNo()
    //   }
    // }
    // return ctx
  }
}
