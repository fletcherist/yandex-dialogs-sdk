import { WebhookRequest } from './webhook'

export interface CtxInterface {
  req: WebhookRequest
  sessionId: string
  messageId: string
  userId: string
  payload: {}
  message: string
  // session: Session

  // command?: Command

  // replyBuilder: ReplyBuilder
  // buttonBuilder: ButtonBuilder

  sendResponse: (response: string) => void
  enterScene: () => void
  leaveScene: () => void
}