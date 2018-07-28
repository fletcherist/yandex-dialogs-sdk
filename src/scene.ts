import Alice from './alice'
import Commands from './commands'
import Command from './command'

import { IConfig } from './types/alice'
import { WebhookRequest, WebhookResponse } from './types/webhook'
import { IContext } from './types/context'

export default class Scene extends Alice {
    public name: string
    public enterCommand: Commands
    public leaveCommand: Commands
    protected commands: Commands
    protected config: IConfig
    protected anyCallback: (ctx: IContext) => void

    constructor(name, config: IConfig = {}) {
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
        if (!name) {
            throw new Error('Enter command name is not specified')
        }
        this.enterCommand = new Commands(this.config.fuseOptions || null)
        this.enterCommand.add(name, callback)
    }

    /*
   * Trigger to leave the scene
   */
    public leave(name, callback) {
        if (!name) {
            throw new Error('Leave command name is not specified')
        }
        this.leaveCommand = new Commands(this.config.fuseOptions || null)
        this.leaveCommand.add(name, callback)
    }

    public command(name, callback) {
        this.commands.add(name, callback)
    }

    public any(callback) {
        this.anyCallback = callback
    }

    public async isEnterCommand(ctx) {
        if (!this.enterCommand) {
            return false
        }
        const matched = await this.enterCommand.search(ctx)
        return matched.length !== 0
    }

    public async isLeaveCommand(ctx) {
        if (!this.leaveCommand) {
            return false
        }
        const matched = await this.leaveCommand.search(ctx)
        return matched.length !== 0
    }

    public async handleSceneRequest(
        req: WebhookRequest,
        sendResponse: (res: WebhookResponse) => void,
        ctx: IContext,
        type: string = null
    ): Promise<any> {
        ctx.sendResponse = sendResponse

        let requestedCommands = []

        if (type === 'enter') {
            requestedCommands = [this.enterCommand.get()[0]]
        } else if (type === 'leave') {
            requestedCommands = [this.leaveCommand.get()[0]]
        } else {
            requestedCommands = await this.commands.search(ctx)
        }

        if (requestedCommands.length !== 0) {
            const requestedCommand = requestedCommands[0]
            return await requestedCommand.callback(ctx)
        }

        if (this.anyCallback) {
            return await this.anyCallback(ctx)
        }

        return Promise.resolve()
    }
}

module.exports = Scene
