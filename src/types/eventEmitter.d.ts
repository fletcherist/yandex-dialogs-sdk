

export type EventType = 'MESSAGE_RECIEVED' | 'MESSAGE_CREATED' | 'MESSAGE_SENT'
export interface EventInterface {
  type: EventType,
  callback(event: EventData): void
}
export interface EventEmitterInterface {
  events: EventInterface[]
  subscribe(eventType: EventType, callback: EventInterface['callback'])
  dispatch(eventType: EventType, data: EventData)
}

export interface EventData {

}

