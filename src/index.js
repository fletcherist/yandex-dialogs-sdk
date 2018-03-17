const ReplyBuilder = require('./replyBuilder')
const ButtonBuilder = require('./ButtonBuilder')

const MODE = 'development'
if (MODE === 'production') {
  console.log = () => null
}

const selectCommand = req => req.request.command

class Ctx {
  constructor(request) {
    this.request = request
    this.replyBuilder = new ReplyBuilder(this.request)
    this.buttonBuilder = new ButtonBuilder()

    this.sessionId = request.session.session_id
    this.messageId = request.session.message_id
    this.userId = request.session.user_id
  }

  async reply(replyMessage) {
    if (!replyMessage) {
      throw new Error('Reply message could not be empty.')
    }
    console.log('reply', replyMessage)
  }
}

class Alice {
  constructor() {
    this.commands = []
  }

  on() {

  }

  command(name, callback) {
    this.commands.push({
      name: name.toLowerCase(),
      callback: callback
    })
  }

  composeCtx(request) {
    return new Ctx(request)
  }

  /*
   * Handles every request
   * and find a command and action for that
   */
  listen(request) {
    const requestedCommandName = selectCommand(request)
    const requestedCommands = this.commands.filter(command =>
      command.name === requestedCommandName)

    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return requestedCommand.callback.call(this, this.composeCtx(request))
    }
    console.log(requestedCommands)
  }
}

const alice = new Alice()

const req = {
  "meta": {
    "locale": "ru-RU",
    "timezone": "Europe/Moscow",
    "client_id": "ru.yandex.searchplugin/5.80 (Samsung Galaxy; Android 4.4)"
  },
  "request": {
     "type": "SimpleUtterance",
     "markup": {
        "dangerous_context": true
     },
     "command": "архангельск",
     "original_utterance": "Алиса вызови игру в города. Архангельск.",
     "payload": {}
  },
  "session": {
    "new": true,
    "session_id": "2eac4854-fce721f3-b845abba-20d60",
    "message_id": 4,
    "skill_id": "3ad36498-f5rd-4079-a14b-788652932056",
    "user_id": "AC9WC3DF6FCE052E45A4566A48E6B7193774B84814CE49A922E163B8B29881DC"
  },
  "version": "1.0"
}

alice.command('архангельск', (ctx) => {
  const button = ctx.buttonBuilder
    .text('hello')
    .get()
  const replyMessage = ctx.replyBuilder
    .text('blabla')
    .tts('yoyoyo')
    .addButton(button)
    .get()
  ctx.reply(replyMessage)
    .then(console.log)
    .catch(console.error)
})

alice.listen(req)
