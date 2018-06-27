const Commands = require('./commands')
const Command = require('./commands').Command
const Ctx = require('./ctx')
const Alice = require('./alice')

const selectCommand = req => req.request.command

class Scene extends Alice {
  constructor(name, config = {}) {
    super()
    this.name = name
    this.anyCallback = null
    this.commands = new Commands(config.fuseOptions || null)
    this.config = config

    this.enterCommand = null
    this.leaveCommand = null
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
    this.commands.add(name, callback)
  }

  /*
   * Trigger to leave the scene
   */
  leave(name, callback) {
    if (!name) throw new Error('Leave command name is not specified')
    this.leaveCommand = new Command(name, callback)
    this.commands.add(name, callback)
  }

  command(name, callback) {
    this.commands.add(name, callback)
  }

  any(callback) {
    this.anyCallback = callback
  }

  isEnterCommand(commandName) {
    if (!this.enterCommand) return false
    return this.enterCommand.name.toLowerCase() === commandName.toLowerCase()
  }

  isLeaveCommand(commandName) {
    if (!this.leaveCommand) return false
    return this.leaveCommand.name.toLowerCase() === commandName.toLowerCase()
  }

  async handleRequest(req, sendResponse) {
    const requestedCommandName = selectCommand(req)
    const requestedCommands = this.commands.search(requestedCommandName)

    if (this.isLeaveCommand(requestedCommandName)) {
      this._handleLeaveScene()
    }

    const ctx = new Ctx({
      req: req,
      sendResponse: sendResponse || null,
      leaveScene: super._handleLeaveScene,
      enterScene: super._handleEnterScene
    })

    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return await requestedCommand.callback.call(this, ctx)
    }

    if (this.anyCallback) {
      return this.anyCallback.call(this, ctx)
    }

    return null
  }
}

module.exports = Scene
