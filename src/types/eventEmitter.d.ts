

export type EventType = 'MESSAGE_RECIEVED' | 'MESSAGE_CREATED' | 'MESSAGE_SENT'
export interface EventInterface {
  type: string,
  callback(event: EventData): void
}
export interface EventEmitterInterface {
  events: EventInterface[]
  subscribe(eventType: string, callback: EventInterface['callback'])
  dispatch(eventType: string, data: any)
}

export interface EventData {
  timestamp: string
  type: string
  data: any
}
