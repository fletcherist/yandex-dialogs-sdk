class ReplyBuilder {
  constructor(request) {
    this.reply = {
      response: {
        buttons: []
      },
      session: request.session,
      version: {}
    }
  }

  text(textMessage) {
    this.reply.response.text = textMessage
    return this
  }

  tts(ttsMessage) {
    this.reply.response.tts = ttsMessage
    return this
  }

  addButton(button) {
    if (!button) {
      throw new Error('Button block can not be empty')
    }
    this.reply.response.buttons.push(button)
    return this
  }

  shouldEndSession(flag) {
    this.reply.response.end_session = flag
  }

  get() {
    return this.reply
  }
}

module.exports = ReplyBuilder
