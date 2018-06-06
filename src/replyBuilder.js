const {
  DEFAULT_END_SESSION,
  ALICE_PROTOCOL_VERSION
} = require('./constants')

class ReplyBuilder {
  constructor(request) {
    this.reply = {
      response: {
        buttons: [],
        end_session: DEFAULT_END_SESSION
      },
      session: request.session,
      version: ALICE_PROTOCOL_VERSION
    }
  }

  text(textMessage) {
    if (!textMessage) {
      throw new Error('Text message for reply could not be empty!')
    }
    this.reply.response.text = textMessage
    return this
  }

  tts(ttsMessage) {
    if (!ttsMessage) {
      throw new Error('Text-to-speech message for Alice can not be empty!')
    }
    this.reply.response.tts = ttsMessage
    return this
  }

  addButton(button) {
    if (!button) {
      throw new Error('Button block can not be empty!')
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
