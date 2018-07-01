const Alice = require('../dist/index')
const alice = new Alice()

/*
 * RU:
 * Для поиска по ключевым словам можно
 * использовать:
 * 1. Строки
 * 2. Массивы строк
 * 3. Регулярные выражения
 *
 * Для строк и массивов строк использутся fuzzysearch (fuse.js)
 * В случае с регулярными выражениями вы пишете триггер сами.
 *
 */

alice.welcome(async (ctx) => {
  ctx.reply('Привет! Смотри, что я могу')
})

// Example for pure strings #1
alice.command('дай совет', async (ctx) => {
  ctx.reply('Make const not var')
})

// Example for array of strings #2
alice.command(['сколько стоит bitcoin', 'стоимость bitcoin', 'цена биткоина'], ctx => {
  // Will trigger on any string above
  ctx.reply('now 8800$')
})

// Example for regular expressions #3
alice.command(/(https?:\/\/[^\s]+)/g, ctx => {
  ctx.reply('I am matching any url you send me.')
})

alice.any(async (ctx) => {
  ctx.reply('О чём это вы?')
})

alice.listen('/', 8080)
