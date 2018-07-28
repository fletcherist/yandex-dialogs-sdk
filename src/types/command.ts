import Context from '../context'
import { IContext } from './context'

export type CallbackType = (ctx: IContext) => void
export type CommandNameType = ((ctx: IContext) => boolean) | any[] | string | RegExp
export type CommandType = 'string' | 'figure' | 'regexp' | 'array' | 'matcher'

export interface ICommand {
    callback: CallbackType
    name: CommandNameType
    type: CommandType
}
