import { WebhookRequest, WebhookResponse } from './webhook'
import ReplyBuilder from '../replyBuilder'
import ButtonBuilder from '../buttonBuilder'

export interface IContext {
  req: WebhookRequest
  sessionId: string
  messageId: string
  userId: string
  payload: {}
  message: string
  session: {}

  // command?: Command

  replyBuilder: ReplyBuilder
  buttonBuilder: ButtonBuilder

  reply: (replyMessage: string | {}) => Promise<WebhookResponse>
  sendResponse: (response: WebhookResponse) => void
  enterScene: (sceneName: string) => void
  leaveScene: () => void
}
