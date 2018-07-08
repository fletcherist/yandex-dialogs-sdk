

export type EventType = 'MESSAGE_RECIEVED' | 'MESSAGE_CREATED' | 'MESSAGE_SENT'
export interface EventQueueInterface {
  events: EventInterface[]
  push(eventType: EventType, callback: EventInterface['callback'])
  dispatch(eventType: EventType, data: EventData)
}

export interface EventData {

}

export interface EventInterface {
  type: EventType,
  callback(event: EventData): void
}
