import { WebhookRequest } from '../types/webhook'
export const generateRequest = (commandText, utteranceText?): WebhookRequest => ({
  meta: {
    client_id: 'Developer Console',
    locale: 'ru-RU',
    timezone: 'UTC',
  },
  request: {
    command: commandText,
    original_utterance: utteranceText || commandText,
    type: 'SimpleUtterance',
  },
  session: {
    message_id: 0,
    new: true,
    session_id: '6d0d2a2e-f14149b9-33febdb2-8037',
  },
  version: '1.0',
})

module.exports.generateRequest = generateRequest
