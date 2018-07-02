/* eslint camelcase: 0 */

const {
  DEFAULT_END_SESSION,
  ALICE_PROTOCOL_VERSION,
} = require('./constants')
import { ButtonParams } from './button'

interface ReplyType {
  response: {
    text: string,
    buttons?: ButtonParams[],
    end_session: boolean,
  },
  session?: {},
  version: string,
}

interface ParamsType {
  text: string,
  tts?: string,
  shouldEndSession?: boolean,
  endSession?: boolean,
  end_session?: boolean,
  session: {},
  buttons: any[]
}
const reply = (params: ParamsType) => {
  const data: ReplyType = {
    response: {
      buttons: [],
      end_session: DEFAULT_END_SESSION,
    },
    session: null,
    version: ALICE_PROTOCOL_VERSION,
  }

  if (typeof params === 'string') {
    data.response.text = params
    return data
  } else if (typeof params === 'object') {
    const {
      text,
      tts,
      shouldEndSession,
      endSession,
      end_session,
      session,
      buttons,
    } = params

    if (text) { data.response.text = text }
    if (tts) { data.response.tts = tts }
    if (buttons) { data.response.buttons = buttons }
    if (shouldEndSession || end_session || endSession) {
      data.response.end_session = shouldEndSession || end_session || endSession
    }
    if (session) { data.session = session }

    return data
  } else {
    throw new Error('reply: invalid parameter. Use Object or String instead')
  }
}

module.exports = reply
