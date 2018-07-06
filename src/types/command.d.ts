import Ctx from '../ctx'
import { CtxInterface } from './ctx'

export type CallbackType = (ctx: CtxInterface) => CtxInterface

export interface CommandInterface {
  callback: CallbackType
}
