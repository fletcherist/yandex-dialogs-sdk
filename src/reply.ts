/* eslint camelcase: 0 */
import {
  DEFAULT_END_SESSION,
  ALICE_PROTOCOL_VERSION,
} from './constants'
import { ButtonParams } from './types/button'
import { WebhookResponse } from './types/webhook'
import { BigImageCard, ItemsListCard } from './types/card'

interface ReplyType {
  response: {
    text: string,
    buttons?: ButtonParams[],
    end_session: boolean,
  },
  session?: {} | null,
  version: string,
}

interface ParamsType {
  text: string,
  tts?: string,
  shouldEndSession?: boolean,
  endSession?: boolean,
  end_session?: boolean,
  session?: {},
  buttons?: any[],
  card?: BigImageCard | ItemsListCard
}
export const reply = (params: ParamsType): WebhookResponse => {
  const data: WebhookResponse = {
    response: {
      text: '',
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
      endSession,
      end_session,
      session,
      buttons,
    } = params

    data.response = Object.assign(data.response, params)
    if (text) { data.response.text = text }
    if (tts) { data.response.tts = tts }
    if (buttons) { data.response.buttons = buttons }
    if (end_session || endSession) {
      data.response.end_session = end_session || endSession
    }
    if (session) { data.session = session }

    return data
  } else {
    throw new Error('reply: invalid parameter. Use Object or String instead')
  }
}

export default reply
module.exports = reply
