import { WebhookRequest, WebhookResponse } from './webhook'
import ReplyBuilder, {IReply} from '../replyBuilder'
import ButtonBuilder from '../buttonBuilder'
import { EventEmitterInterface } from './eventEmitter'
import Scene from '../scene'

export interface IContext {
  req: WebhookRequest
  sessionId: string
  messageId: string
  userId: string
  payload: {}
  message: string
  session: {}
  originalUtterance: string
  eventEmitter: EventEmitterInterface

  // command?: Command

  replyBuilder: ReplyBuilder
  buttonBuilder: ButtonBuilder

  reply: (replyMessage: string | IReply) => void
  goodbye: (replyMessage: string | IReply) => void
  sendResponse: (response: WebhookResponse) => void
  enterScene: (scene: Scene) => void
  leaveScene: () => void
}
