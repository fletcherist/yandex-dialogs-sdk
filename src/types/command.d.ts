import Ctx from '../ctx'
import { CtxInterface } from './ctx'

export type CallbackType = (ctx: CtxInterface) => CtxInterface

export type CommandType = 'string' | 'figure' | 'regexp' | 'array'
export interface CommandInterface {
  callback: CallbackType
  name: any[] | string | RegExp
  type: CommandType
}
