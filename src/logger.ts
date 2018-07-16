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

const logTime = (timestamp: string) => {
  const event = new Date(timestamp)
  return event.toLocaleString('en-US')
}

export default class Logger {
  constructor() {
    eventEmitter.subscribe(EVENT_MESSAGE_RECIEVED, this.log)
    eventEmitter.subscribe(EVENT_MESSAGE_SENT, this.log)
  }

  public log(event: EventData) {
    // tslint:disable-next-line:no-console
    console.log(
      [
        colors.info(`[${logTime(event.timestamp)}]:`),
        colors.verbose(`(${event.type})`),
        colors.warn(event.data),
      ].join(' '),
    )
  }
}
