import {
  EventEmitterInterface,
  EventType,
  EventInterface,
  EventData,
} from './types/eventEmitter'

class EventEmitter implements EventEmitterInterface {
  public events: EventInterface[]
  constructor() {
    this.events = []
  }
  public subscribe(eventType: string, callback: EventInterface['callback']) {
    this.events.push({
      type: eventType,
      callback,
    })
  }
  public dispatch(eventType: string, dataValue?) {
    for (const event of this.events) {
      const eventData: EventData = {
        timestamp: new Date().toString(),
        type: eventType,
        data: dataValue && dataValue.data,
        session: dataValue && dataValue.session,
      }
      if (event.type === eventType) {
        event.callback(eventData)
      }
    }
  }
}

const eventEmitter = new EventEmitter()
export default eventEmitter
