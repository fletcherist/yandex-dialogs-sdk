const { reversedInterpolation, selectCommand } = require('./utils')
import Session from './session'

import ReplyBuilder from './replyBuilder'
import ButtonBuilder from './buttonBuilder'
import Command from './command'

export default class Ctx {
  public req: {}
  public sessionId: string
  public messageId: string
  public userId: string
  public payload: {}
  public message: string
  public session: Session

  public command?: Command

  public replyBuilder: ReplyBuilder
  public buttonBuilder: ButtonBuilder

  private sendResponse: (response: string) => void
  private enterScene: () => void
  private leaveScene: () => void
  constructor({
    req,
    sendResponse,
    session,

    enterScene,
    leaveScene,

    command,
  }) {
    this.req = req
    this.sendResponse = sendResponse

    this.sessionId = req.session.session_id
    this.messageId = req.session.message_id
    this.userId = req.session.user_id
    this.payload = req.request.payload
    this.message = req.request.original_utterance

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

  public async reply(replyMessage) {
    if (!replyMessage) {
      throw new Error('Reply message could not be empty!')
    }

    /*
     * Если @replyMessage — string,
     * то заворачиваем в стандартную форму.
     */
    if (typeof replyMessage === 'string') {
      replyMessage = this.replyBuilder
        .text(replyMessage)
        .tts(replyMessage)
        .get()

      // Is no session, lets use context session
      if (!replyMessage.session) {
        replyMessage.session = this.session
      }
    }
    return this._sendReply(replyMessage)
  }

  public _sendReply(replyMessage) {
    /*
     * That fires when listening on port.
     */
    if (typeof this.sendResponse === 'function') {
      return this.sendResponse(replyMessage)
    }

    return replyMessage
  }
}

module.exports = Ctx
