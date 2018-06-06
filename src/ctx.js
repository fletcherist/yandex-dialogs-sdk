const ReplyBuilder = require('./replyBuilder')
const ButtonBuilder = require('./buttonBuilder')
const { reversedInterpolation } = require('./utils')

const {
  selectCommand,
  selectSession,
  selectSessionId,
  selectUserId,
  isFunction
} = require('./utils')

class Ctx {
  constructor({
    req,
    sendResponse,
    session,

    enterScene,
    leaveScene,

    command
  }) {
    this.req = req
    this.sendResponse = sendResponse

    this.sessionId = req.session.session_id
    this.messageId = req.session.message_id
    this.userId = req.session.user_id
    this.payload = req.request.payload
    this.messsage = req.request.original_utterance

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

  async reply(replyMessage) {
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

      replyMessage.session = this.session
    }
    return this._sendReply(replyMessage)
  }

  _sendReply(replyMessage) {
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
