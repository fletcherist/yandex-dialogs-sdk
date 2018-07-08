import Ctx from '../ctx'
import { CtxInterface } from './ctx'

export type CallbackType = (ctx: CtxInterface) => void
export type CommandNameType = (ctx: CtxInterface) => boolean | any[] | string | RegExp
export type CommandType = 'string' | 'figure' | 'regexp' | 'array' | 'matcher'
export interface CommandInterface {
  callback: CallbackType
  name: CommandNameType
  type: CommandType
}
