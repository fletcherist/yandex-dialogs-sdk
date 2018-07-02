import Alice from './alice'
import Commands from './commands'
import Command from './Command'
import Ctx from './ctx'

const selectCommand = (req) => req.request.command

export default class Scene extends Alice {
  public name: string
  public enterCommand: Command
  public leaveCommand: Command
  public anyCallback: (ctx: Ctx) => void
  public commands: Commands
  public config: {}

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

  public on(event) {
    /* enter, leave, etc */
  }

  /*
   * Trigger to activate the scene
   */
  public enter(name, callback) {
    if (!name) { throw new Error('Enter command name is not specified') }
    this.enterCommand = new Command(name, callback)
    this.commands.add(name, callback)
  }

  /*
   * Trigger to leave the scene
   */
  public leave(name, callback) {
    if (!name) { throw new Error('Leave command name is not specified') }
    this.leaveCommand = new Command(name, callback)
    this.commands.add(name, callback)
  }

  public command(name, callback) {
    this.commands.add(name, callback)
  }

  public any(callback) {
    this.anyCallback = callback
  }

  public isEnterCommand(commandName) {
    if (!this.enterCommand) { return false }
    return this.enterCommand.name.toLowerCase() === commandName.toLowerCase()
  }

  public isLeaveCommand(commandName) {
    if (!this.leaveCommand) { return false }
    return this.leaveCommand.name.toLowerCase() === commandName.toLowerCase()
  }

  public async handleRequest(req, sendResponse, session) {
    const requestedCommandName = selectCommand(req)
    const requestedCommands = this.commands.search(requestedCommandName)

    if (this.isLeaveCommand(requestedCommandName)) {
      this._handleLeaveScene()
    }

    const ctx = new Ctx({
      req,
      sendResponse: sendResponse || null,
      leaveScene: super._handleLeaveScene,
      enterScene: super._handleEnterScene,
      session,
    })

    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return await requestedCommand.callback.call(this, ctx)
    }

    if (this.anyCallback) {
      return this.anyCallback(ctx)
    }

    return null
  }
}

module.exports = Scene
