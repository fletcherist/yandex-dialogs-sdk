// Для асинхронной работы используется пакет micro.
const { json } = require('micro');
const { Alice, Reply } = require('yandex-dialogs-sdk');
const alice = new Alice();

alice.command('say my name', ctx => {
  return Reply.text('mr white'); // you're goddamn right
});

alice.any(ctx => Reply.text('Я вас не поняла'));

// Запуск асинхронного сервиса.
module.exports = async req => {
  // Из запроса извлекаются свойства request, session и version.
  const request = await json(req);

  // Обработчики пойдут наверх искать подходящую команду
  // И составлять ответ на её основе.
  return await alice.handleRequest(request);
};
