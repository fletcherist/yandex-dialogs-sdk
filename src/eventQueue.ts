import {
  EventQueueInterface,
  EventType,
  EventInterface,
  EventData,
} from './types/eventQueue'

export default class EventQueue implements EventQueueInterface {
  public events: EventInterface[]
  constructor() {
    this.events = []
  }
  public push(eventType: EventType, callback: EventInterface['callback']) {
    this.events.push({
      type: eventType,
      callback,
    })
  }
  public dispatch(eventType: EventType, data: EventData) {
    for (const event of this.events) {
      if (event.type === eventType) {
        event.callback(data)
      }
    }
  }
}
