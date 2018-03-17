const express = require('express')
const bodyParser = require('body-parser')

const Ctx = require('./ctx')
const selectCommand = req => req.request.command

class Alice {
  constructor() {
    this.commands = []
  }

  on() {

  }

  command(name, callback) {
    this.commands.push({
      name: name.toLowerCase(),
      callback: callback
    })
  }

  async handleRequestBody(req) {
    const requestedCommandName = selectCommand(req)
    const requestedCommands = this.commands.filter(command =>
      command.name === requestedCommandName)

    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return await requestedCommand.callback.call(this, new Ctx({
        req: req
      }))
    }
    console.log(requestedCommands)
  }

  /*
   * Handles every request
   * and find a command and action for that
   */
  listen(callbackUrl = '/', port = 80) {

    const app = express()
    app.use(bodyParser.json())
    app.post(callbackUrl, async (req, res) => {
      console.log(req.body)
      const replyMessage = await this.handleRequestBody(req.body)
      console.log(replyMessage)
      res.send(replyMessage)
    })
    app.listen(port, () => console.log(`Alice is listening on ${port} port`))
  }
}

module.exports = Alice