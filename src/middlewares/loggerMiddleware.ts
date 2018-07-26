import {
  EVENT_MESSAGE_RECIEVED,
  EVENT_MESSAGE_SENT,
  EVENT_MESSAGE_NOT_SENT,
  EVENT_MESSAGE_PROXIED,
  EVENT_MESSAGE_PROXY_ERROR,
} from '../constants'

import chalk from 'chalk'
import log from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
}

prefix.reg(log)
prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${name}:`)}`
  },
})

prefix.apply(log.getLogger('critical'), {
  format(level, name, timestamp) {
    return chalk.red.bold(`[${timestamp}] ${level} ${name}:`)
  },
})

/*
  log.trace(msg)
  log.debug(msg)
  log.info(msg)
  log.warn(msg)
  log.error(msg)
*/

interface ILogger {
  level?: number
}

export default function createLoggerMiddleware(opts: ILogger = {}) {
  const eventTypes = {
    [EVENT_MESSAGE_RECIEVED]: 'info',
    [EVENT_MESSAGE_SENT]: 'info',
    [EVENT_MESSAGE_NOT_SENT]: 'warn',
    [EVENT_MESSAGE_PROXIED]: 'info',
    [EVENT_MESSAGE_PROXY_ERROR]: 'error',
  }
  let isInitialized = false
  return (ctx) => {
    if (isInitialized) {
      return ctx
    }

    log.setLevel(opts.level || 0)

    ctx.eventEmitter.subscribe(EVENT_MESSAGE_RECIEVED, logEvent)
    ctx.eventEmitter.subscribe(EVENT_MESSAGE_SENT, logEvent)
    ctx.eventEmitter.subscribe(EVENT_MESSAGE_NOT_SENT, logEvent)
    ctx.eventEmitter.subscribe(EVENT_MESSAGE_PROXIED, logEvent)
    ctx.eventEmitter.subscribe(EVENT_MESSAGE_PROXY_ERROR, logEvent)

    function logEvent(event) {
      try {
        log[eventTypes[event.type]]([
          `{${chalk.cyan(event.type)}}`, event.data,
        ].filter(Boolean).join(' '))
      } catch (error) {
        log.error(`Cant log "${event.type}"`)
      }
    }

    isInitialized = true
    return ctx
  }
}
