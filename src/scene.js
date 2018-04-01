const Commands = require('./commands')
const Command = require('./commands').Command
const Ctx = require('./ctx')
const Alice = require('./alice')

const selectCommand = req => req.request.command
class Scene extends Alice {
  constructor(name) {
    super()
    this.name = name
    this.commands = new Commands()

    this.enterCommand = null
    this.leaveCommand = null
    console.log(this)
  }
  get title() {
    return this.name
  }

  on(event) {
    /* enter, leave, etc */
  }

  /*
   * Trigger to activate the scene
   */
  enter(name, callback) {
    if (!name) throw new Error('Enter command name is not specified')
    this.enterCommand = new Command(name, callback)
  }

  /*
   * Trigger to leave the scene
   */
  leave(name, callback) {
    if (!name) throw new Error('Leave command name is not specified')
    this.leaveCommand = new Command(name, callback)
  }

  command(name, callback) {
    this.commands.add(name, callback)
  }

  async handleRequest(req) {
    const requestedCommandName = selectCommand(req)
    const requestedCommands = this.commands.search(requestedCommandName)

    const ctx = new Ctx({
      req: req,
      sendResponse: null,
      leaveScene: this._handleLeaveScene.bind(this, this.name),
      enterScene: this._handleEnterScene
    })

    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return await requestedCommand.callback.call(this, ctx)
    }
  }
}

const scene1 = new Scene('main_scene')
scene1.command('привет', ctx => {
  console.log(ctx)
  ctx.leaveScene()
})

const generateRequest = (commandText, utteranceText) => ({
  'meta': {
    'client_id': 'Developer Console',
    'locale': 'ru-RU',
    'timezone': 'UTC'
  },
  'request': {
    'command': commandText,
    'original_utterance': utteranceText || commandText,
    'type': 'SimpleUtterance'
  },
  'session': {
    'message_id': 0,
    'new': true
  },
  'version': '1.0'
})

scene1.handleRequest(generateRequest('привет'))

module.exports = Scene
