const ReplyBuilder = require('./replyBuilder')
const ButtonBuilder = require('./ButtonBuilder')

class Ctx {
  constructor({
    req,
    sendResponse,

    enterScene,
    leaveScene
  }) {
    this.req = req
    this.sendResponse = sendResponse

    this.sessionId = req.session.session_id
    this.messageId = req.session.message_id
    this.userId = req.session.user_id
    this.payload = req.request.payload
    this.messsage = req.request.original_utterance

    this.replyBuilder = new ReplyBuilder(this.req)
    this.buttonBuilder = new ButtonBuilder()

    if (enterScene && leaveScene) {
      this.enterScene = enterScene
      this.leaveScene = leaveScene
    }
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
