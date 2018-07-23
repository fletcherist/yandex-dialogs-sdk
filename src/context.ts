import { reversedInterpolation, selectCommand } from './utils'
import Session from './session'

import ReplyBuilder, { IReply } from './replyBuilder'
import ButtonBuilder from './buttonBuilder'

import { WebhookResponse, WebhookRequest } from './types/webhook'
import { EventEmitterInterface } from './types/eventEmitter'
import { IContext } from './types/context'
import { ICommand } from './types/command'
import { BigImageCard } from './types/card'
import { image, bigImageCard, itemsListCard } from './card'
import reply from './reply'
import eventEmitter from './eventEmitter'

import { EVENT_MESSAGE_SENT } from './constants'

export default class Context implements IContext {
  public req: WebhookRequest
  public sessionId: string
  public messageId: string
  public userId: string
  public payload: {}
  public message: string
  public session: Session
  public originalUtterance: string
  public eventEmitter: EventEmitterInterface

  public command?: ICommand

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
    this.originalUtterance = req.request.original_utterance

    this.session = session

    this.eventEmitter = eventEmitter
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
    if (typeof this.command.name === 'string') {
      return reversedInterpolation(this.command.name, requestText)
    }

    return null
  }

  public reply(replyMessage: string | IReply): void {
    if (typeof replyMessage === 'undefined') {
      throw new Error('Reply message could not be empty!')
    }

    const message = this._createReply(replyMessage)
    this._sendReply(message)
  }

  // public async replyWithImage(params: string | BigImageCard) {
  //   if (typeof params === 'string') {
  //     // @TODO: fix this please anybody, doesnt work at all
  //     const message = this._createReply(reply(bigImageCard(image(params))))
  //     return this._sendReply(message)
  //   } else {
  //     const message = this._createReply(bigImageCard(params))
  //     return this._sendReply(message)
  //   }
  // }

  // public async replyWithGallery() {

  // }

  public goodbye(replyMessage: string | IReply): void {
    if (typeof replyMessage === 'undefined') {
      throw new Error('Message should be string or result of ReplayBuilder.get')
    }

    const message = this._createReply(replyMessage)
    message.response.end_session = true;

    this._sendReply(message)
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
      eventEmitter.dispatch(EVENT_MESSAGE_SENT, {
        data: replyMessage.response.text, session: this.req.session,
      })

      return this.sendResponse(replyMessage)
    }
    return replyMessage
  }
}
