import { EventData } from './types/eventEmitter'
import colors from 'colors'
import eventEmitter from './eventEmitter'

import {
  EVENT_MESSAGE_RECIEVED,
  EVENT_MESSAGE_SENT,
} from './constants'

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
})

export default class Logger {
  constructor() {
    eventEmitter.subscribe(EVENT_MESSAGE_RECIEVED, this.log)
    eventEmitter.subscribe(EVENT_MESSAGE_SENT, this.log)
  }

  public log(event: EventData) {
    console.log(
      colors.warn(event.data),
    )
  }
}
