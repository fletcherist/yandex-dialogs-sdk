import { IContext } from './context'
import { ICommand } from './command'

export interface IConfig {
    fuseOptions?: {}
    sessionsLimit?: number
    oAuthToken?: string
    skillId?: string
    devServerUrl?: string
    responseTimeout?: number
}

export interface IAlice {
    command(name: ICommand, callback: (IContext) => void): void
    use(middleware: (IContext: IContext) => IContext): void
}
