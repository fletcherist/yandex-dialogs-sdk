alice.command('забронируй встречу в ${where} на ${when}', ctx => {
  const { where, when } = ctx.body
  // where — '7-холмов'
  // when — '18:00'
  ctx.reply(`Готово. Встреча состоится в ${where}. Тебе напомнить?`)
})

alice.command('начни готовить ${what}', ctx => {
  const { what } = ctx.body // завтрак/ужин
  ctx.reply('хорошо')
})

alice.handleRequestBody(generateRequest('забронируй встречу в 7-холмов на 18:00'))
alice.handleRequestBody(generateRequest('начни готовить завтрак'))
alice.handleRequestBody(generateRequest('начни готовить ужин'))
