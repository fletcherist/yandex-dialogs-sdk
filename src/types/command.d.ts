import Ctx from '../ctx'
import { CtxInterface } from './ctx'

export type CallbackType = (ctx: CtxInterface) => CtxInterface
export type MatcherType = (ctx: CtxInterface) => boolean
export type CommandNameType = any[] | string | RegExp | MatcherType
export type CommandType = 'string' | 'figure' | 'regexp' | 'array' | 'matcher'
export interface CommandInterface {
  callback: CallbackType
  name: CommandNameType
  type: CommandType
}
