const express = require('express')
const bodyParser = require('body-parser')

const Ctx = require('./ctx')
const selectCommand = req => req.request.command

class Alice {
  constructor() {
    this.commands = []
    this.any = 
  }

  /* @TODO: Implement watchers (errors, messages) */
  on() {

  }

  command(name, callback) {
    this.commands.push({
      name: name.toLowerCase(),
      callback: callback
    })
  }

  any(callback) {

  }

  async handleRequestBody(req) {
    const requestedCommandName = selectCommand(req)
    const requestedCommands = this.commands.filter(command =>
      command.name === requestedCommandName)

    /*
     * Command has been found in the list.
     * Lets run its handler
     *
     * Команда нашлась в списке.
     * Запускаем её обработчик.
     */
    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return await requestedCommand.callback.call(this, new Ctx({
        req: req
      }))
    }

    /*
     * Такой команды не было зарегестрировано.
     * Переходим в обработчик исключений.
     */
    console.log(requestedCommands)
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