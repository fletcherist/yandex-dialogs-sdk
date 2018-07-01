// Для асинхронной работы используется пакет micro.
const { json } = require('micro')
const Alice = require('../dist/index')
const alice = new Alice()

alice.command('say my name', (ctx) => {
  return ctx.reply('mr white') // you're goddamn right
})

alice.any((ctx) => ctx.reply('Я вас не поняла'))

// Запуск асинхронного сервиса.
module.exports = async req => {
  // Из запроса извлекаются свойства request, session и version.
  const request = await json(req)

  // Обработчики пойдут наверх искать подходящую команду
  // И составлять ответ на её основе.
  return await alice.handleRequestBody(request)
}
