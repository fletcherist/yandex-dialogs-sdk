const Alice = require('yandex-dialogs-sdk')
const alice = new Alice()

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const { button, reply } = Alice
alice.welcome(ctx => {
	const replyMsg = reply({
		text: 'Привет! Я загадала число от 1 до 100. Сможешь отгадать его?',
		buttons: [button('Давай попробуем!'), button('Не хочу')]
	})
	ctx.reply(replyMsg)
})

alice.command('ДАВАЙ ПОПРОБУЕМ', ctx => {
	ctx.state.guessedNumber = random(1, 100)
	ctx.reply('Ну попробуй!')
})
alice.command('Сыграть ещё раз!', ctx => {
	ctx.state.guessedNumber = random(1, 100)
	ctx.reply('Ну попробуй!')	
})
alice.command('Не хочу', ctx => ctx.reply('Спасибо за игру!'))

alice.command(/^\d+$/, ctx => {
	const number = Number(ctx.message)
	if (number > ctx.state.guessedNumber) {
		ctx.reply(`Моё число меньше, чем ${number}`)
	} else if (number < ctx.state.guessedNumber) {
		ctx.reply(`Моё число больше, чем ${number}`)
	} else {
		const replyMsg = reply({
			text: `Ты победил! Я загадала число ${ctx.state.guessedNumber}. Сыграешь ещё раз?`,
			buttons: [button('Сыграть ещё раз!'), button('Не хочу')]
		})
		ctx.reply(replyMsg)
	}
})

alice.any(ctx => {
	ctx.reply('Ты ввёл вообще не число. Попробуй ещё раз!')
})

const port = 3000
alice.listen('/', port, callback => console.log(port))