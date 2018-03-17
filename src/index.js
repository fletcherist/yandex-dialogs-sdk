const MODE = 'development'
if (MODE === 'production') {
  console.log = () => null
}

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
    console.log('command')
  }

  listen(request) {
    const requestedCommandName = selectCommand(request)
    const requestedCommands = this.commands.filter(command =>
      command.name === requestedCommandName)

    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return requestedCommand.callback.call(this, request)
    }
    console.log(requestedCommands)
  }
}

const alice = new Alice()

