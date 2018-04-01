const express = require('express')
const bodyParser = require('body-parser')
const Fuse = require('fuse.js')

const Ctx = require('./ctx')
const selectCommand = req => req.request.command

const makeStringLower = str => typeof str === 'string' ? str.toLowerCase() : str
const isFunction = fn => fn && typeof fn === 'function'

const DEFAULT_ANY_CALLBACK = () => 'Что-то пошло не так. Я не знаю, что на это сказать.'

// declaring possible command types 
const TYPE_STRING = 'string'
const TYPE_REGEXP = 'regexp'
const TYPE_ARRAY  = 'array'

class Alice {
  constructor(config = {}) {
    this.commands = []
    this.anyCallback = DEFAULT_ANY_CALLBACK
    this.fuseOptions = {
      tokenize: true,
      treshold: config.fuzzyTreshold || 0.2,
      distance: config.fuzzyDistance || 10,
      keys: ['name']
    }
    this.middlewares = []
  }

  /* @TODO: Implement watchers (errors, messages) */
  on() {

  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  command(name, callback) {
    let type

    if (typeof name === 'string') {
      type = TYPE_STRING
      name = name.toLowerCase()
    } else if (name instanceof RegExp) {
      type = TYPE_REGEXP
    } else if (Array.isArray(name)) {
      name = name.map(makeStringLower)
      type = TYPE_ARRAY
    } else {
      throw new Error(`Command name is not of proper type.
        Could be only string, array of strings or regular expression`)
    }

    this.commands.push({
      name: name,
      type: type,
      callback: callback
    })
  }

  /*
   * Если среди команд не нашлось той,
   * которую запросил пользователь,
   * вызывается этот колбек
   */
  any(callback) {
    this.anyCallback = callback
  }

  async handleRequestBody(req) {
    const requestedCommandName = selectCommand(req)
    let requestedCommands = []

    const stringCommands = this.commands.filter(cmd => cmd.type !== TYPE_REGEXP)
    const fuse = new Fuse(stringCommands, this.fuseOptions)
    const fuzzyMatches = fuse.search(requestedCommandName)

    const regexpCommands = this.commands.filter(cmd => cmd.type === TYPE_REGEXP)
    // @TODO: include matches and captured groups
    const regexpMatches = regexpCommands.filter(reg => requestedCommandName.match(reg))

    if (fuzzyMatches.length > 0) {
      requestedCommands = fuzzyMatches
    } else if (regexpCommands.length > 0) {
      requestedCommands = regexpMatches
    }

    /*
     * Инициализация контекста запроса
     */
     const ctx = new Ctx({
      req: req
     })
    /*
     * Команда нашлась в списке.
     * Запускаем её обработчик.
     */
    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return await requestedCommand.callback.call(this, ctx)
    }

    /*
     * Такой команды не было зарегестрировано.
     * Переходим в обработчик исключений
     */
    return await this.anyCallback.call(this, ctx)
  }

  /*
   * Метод создаёт сервер, который слушает указанный порт.
   * Когда на указанный URL приходит POST запрос, управление
   * передаётся в @handleRequestBody
   *
   * При получении ответа от @handleRequestBody, результат
   * отправляется обратно.
   */
  async listen(callbackUrl = '/', port = 80, callback) {
    return new Promise(resolve => {
      resolve()
      const app = express()
      app.use(bodyParser.json())
      app.post(callbackUrl, async (req, res) => {
        const replyMessage = await this.handleRequestBody(req.body)
        res.send(replyMessage)
      })
      app.listen(port, () => {
        // Resolves with callback function
        if (isFunction(callback)) {
          return callback.call(this)
        }


        // If no callback specified, resolves as a promise.
        return Promise.resolve()
        // Resolves with promise if no callback set
      })
    })
  }
}

module.exports = Alice