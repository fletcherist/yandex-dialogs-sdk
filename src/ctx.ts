const { reversedInterpolation, selectCommand } = require('./utils')
import Session from './session'

import ReplyBuilder from './replyBuilder'
import ButtonBuilder from './buttonBuilder'

import { WebhookResponse, WebhookRequest } from './types/webhook'
import { CtxInterface } from './types/ctx'
import { CommandInterface } from './types/command'
<<<<<<< HEAD
import { EventEmitterInterface } from './types/eventEmitter'
=======
import { BigImageCard } from './types/card'
import { image, bigImageCard, itemsListCard } from './card'
import reply from './reply'
>>>>>>> master

export default class Ctx implements CtxInterface {
  public req: WebhookRequest
  public sessionId: string
  public messageId: string
  public userId: string
  public payload: {}
  public message: string
  public session: Session
  public EventEmitter: EventEmitterInterface

  public command?: CommandInterface

  public replyBuilder: ReplyBuilder
  public buttonBuilder: ButtonBuilder

  public sendResponse: (response: WebhookResponse) => void
  public enterScene: (sceneName: string) => void
  public leaveScene: () => void
  constructor(params) {
    const {
      req,
      sendResponse,
      session,

      enterScene,
      leaveScene,

      command,
    } = params

    this.req = req
    this.sendResponse = sendResponse

    this.sessionId = req.session.session_id
    this.messageId = req.session.message_id
    this.userId = req.session.user_id
    this.payload = req.request.payload
    this.message = req.request.command

    this.session = session

    this.replyBuilder = new ReplyBuilder(this.req)
    this.buttonBuilder = new ButtonBuilder()

    if (enterScene && leaveScene) {
      this.enterScene = enterScene
      this.leaveScene = leaveScene
    }

    if (command) {
      this.command = command
    }
  }

  get body() {
    const requestText = selectCommand(this.req)
    return reversedInterpolation(this.command.name, requestText)
  }

  public async reply(replyMessage: string | {}): Promise<WebhookResponse> {
    if (typeof replyMessage === 'undefined') {
      throw new Error('Reply message could not be empty!')
    }

    const message = this._createReply(replyMessage)
    return this._sendReply(message)
  }

  public async replyWithImage(params: string | BigImageCard) {
    if (typeof params === 'string') {
      const message = this._createReply(reply(bigImageCard(image(params))))
      return this._sendReply(message)
    } else {
      const message = this._createReply(bigImageCard(params))
      return this._sendReply(message)
    }
  }

  public async replyWithGallery() {

  }

  public _createReply(replyMessage): WebhookResponse {
    /*
    * Если @replyMessage — string,
    * то заворачиваем в стандартную форму.
    */
    if (typeof replyMessage === 'string') {
      replyMessage = this.replyBuilder
        .text(replyMessage)
        .tts(replyMessage)
        .get()
    }
    // Is no session, lets use context session
    if (!replyMessage.session) {
      replyMessage.session = this.session
    }
    return replyMessage
  }

  private _sendReply(replyMessage: WebhookResponse) {
    /*
     * That fires when listening on port.
     */
    if (typeof this.sendResponse === 'function') {
      return this.sendResponse(replyMessage)
    }

    return replyMessage
  }

  public getDefaultRespons
}
