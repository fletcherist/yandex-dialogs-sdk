const express = require('express')
const bodyParser = require('body-parser')
const fuzzysearch = require('fuzzysearch')

const Ctx = require('./ctx')
const selectCommand = req => req.request.command

const DEFAULT_ANY_CALLBACK = () => 'Что-то пошло не так. Я не знаю, что на это сказать.'

class Alice {
  constructor() {
    this.commands = []
    this.anyCallback = DEFAULT_ANY_CALLBACK
  }

  /* @TODO: Implement watchers (errors, messages) */
  on() {

  }

  command(name, callback) {
    let type

    if (typeof name === 'string') {
      type = 'string'
      name = name.toLowerCase()
    } else if (name instanceof RegExp) {
      type = 'regexp'
    } else if (Array.isArray(name)) {
      type = 'array'
    } else {
      throw new Error('Unexpecto patronus')
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
   * вызывается этот коллбек
   */
  any(callback) {
    this.anyCallback = callback
  }

  async handleRequestBody(req) {
    const requestedCommandName = selectCommand(req)

    const requestedCommands = this.commands.filter(command =>
      command.name === requestedCommandName)


    /*
     * Инициализация контекста запроса
     */
     const ctx = new Ctx({
      req: req
     })
    /*
     * Command has been found in the list.
     * Lets run its handler
     *
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
  listen(callbackUrl = '/', port = 80) {
    const app = express()
    app.use(bodyParser.json())
    app.post(callbackUrl, async (req, res) => {
      const replyMessage = await this.handleRequestBody(req.body)
      res.send(replyMessage)
    })
    app.listen(port, () => console.log(`Alice is listening on ${port} port`))
  }
}

module.exports = Alice