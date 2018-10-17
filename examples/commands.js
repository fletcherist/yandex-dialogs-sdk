const { Alice, Reply } = require('yandex-dialogs-sdk');
const alice = new Alice();

/*
 * RU:
 * Для поиска по ключевым словам можно
 * использовать:
 * 1. Строки
 * 2. Массивы строк
 * 3. Регулярные выражения
 *
 * For strings we use levenshtein distance.
 * В случае с регулярными выражениями вы пишете триггер сами.
 */

// Example for pure strings #1
alice.command('дай совет', async ctx => {
  return Reply.text('Make const not var');
});

// Example for array of strings #2
alice.command(
  ['сколько стоит bitcoin', 'стоимость bitcoin', 'цена биткоина'],
  ctx => {
    // Will trigger on any string above
    return Reply.text('now 8800$');
  },
);

// Example for regular expressions #3
alice.command(/(https?:\/\/[^\s]+)/g, ctx => {
  return Reply.text('I am matching any url you send me.');
});

alice.any(async ctx => {
  return Reply.text('О чём это вы?');
});

alice.listen(8080, '/');
