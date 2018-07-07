import { ButtonInterface } from './button'
export interface WebhookRequest {
  meta: {
      locale: string
      timezone: string
      client_id: string
  }
  request: {
      command: string
      original_utterance: string
      type: 'SimpleUtterance' | 'ButtonPressed'
      markup?: {
          dangerous_context?: true
      },
      payload?: object
  }
  session: {
      new: boolean
      message_id: number
      session_id: string
      skill_id: string
      user_id: string
  }
  version: string
}

export interface WebhookResponse {
  response: {
      text: string
      tts?: string
      buttons?: ButtonInterface[]
      end_session?: boolean
  }
  session?: {
      message_id?: number
      session_id?: string
      user_id?: string
  }
  version: string
}