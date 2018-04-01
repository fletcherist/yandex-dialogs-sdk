const Alice = require('../src')
const Scene = require('../src').Scene

const alice = new Alice()

/*
 * Sorry guys for these stupid dialogues
 * Just for educational purposes :)
*/

const myScene = new Scene('on-the-stage')
myScene.enter('Выходи на сцену', ctx => ctx.reply('Я на сцене.'))
myScene.command('ты сейчас на сцене?', ctx => ctx.reply('Да!'))
myScene.leave('Уходи со сцены', ctx => ctx.reply('Уже ухожу.'))

alice.registerScene(myScene)
alice.command('ты сейчас на сцене?', ctx => ctx.reply('Нет!'))

alice.any(ctx => ctx.reply('???'))
alice.listen('/', 8080).then(console.log('listening'))
