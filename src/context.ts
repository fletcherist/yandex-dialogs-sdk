import { compose } from 'ramda'
import { reversedInterpolation, selectCommand } from './utils'
import Session from './session'
import Scene from './scene'

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

  private _isReplied: boolean // forbids to send reply twice
  private scenes: Scene[]

  constructor(params) {
    const {
      req,
      sendResponse,
      session,
      scenes,

      command,
    } = params

    this.req = req
    this.scenes = scenes
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

    this._isReplied = false

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

  public reply(replyMessage: string | IReply): WebhookResponse {
    if (typeof replyMessage === 'undefined') {
      throw new Error('Reply message could not be empty!')
    }

    const message = this._createReply(replyMessage)
    return this._sendReply(message)
  }

  public async replyWithImage(params: string | BigImageCard) {
    if (typeof params === 'string') {
      const message = this._createReply(
        reply({
          text: 'ᅠ ', // empty symbol
          card: compose(bigImageCard, image)(params)
        })
      )
      return this._sendReply(message)
    }
    const message = this._createReply(
      reply({
        text: 'ᅠ ',
        card: bigImageCard(params),
      })
    )
    return this._sendReply(message)
  }

  // public async replyWithGallery() {
  // @TODO
  // }

  public enterScene(scene: Scene): void {
    if (!scene) throw new Error('Please provide scene you want to enter in')
    const matchedScene = this.scenes.find(candidateScene => candidateScene.name === scene.name)
    this.session.setData('currentScene', matchedScene.name)
  }

  public leaveScene(): void {
    this.session.setData('currentScene', null)
  }

  public goodbye(replyMessage: string | IReply): void {
    if (typeof replyMessage === 'undefined') {
      throw new Error('Message should be string or result of ReplyBuilder.get')
    }

    const message = this._createReply(replyMessage)
    message.response.end_session = true;

    this._sendReply(message)
  }

  private _createReply(replyMessage): WebhookResponse {
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

  private _sendReply(replyMessage: WebhookResponse): any {
    if (this._isReplied) return
    this._isReplied = true
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
