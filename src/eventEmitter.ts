import {
  EventEmitterInterface,
  EventType,
  EventInterface,
  EventData,
} from './types/eventEmitter'

export default class EventEmitter implements EventEmitterInterface {
  public events: EventInterface[]
  constructor() {
    this.events = []
  }
  public subscribe(eventType: EventType, callback: EventInterface['callback']) {
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
