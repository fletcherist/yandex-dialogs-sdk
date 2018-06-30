const Fuse = require('fuse.js')

// declaring possible command types
const TYPE_STRING = 'string'
const TYPE_REGEXP = 'regexp'
const TYPE_ARRAY = 'array'

class Commands {
  constructor(config = {}) {
    this.commands = []
    this.fuseOptions = {
      tokenize: false,
      threshold: config.fuzzyTreshold || 0.3,
      distance: config.fuzzyDistance || 10,
      keys: ['name']
    }
  }

  get() {
    return this.commands
  }

  get _strings() {
    return this.commands.filter(cmd => cmd.type !== TYPE_REGEXP)
  }
  get _regexps() {
    return this.commands.filter(cmd => cmd.type === TYPE_REGEXP)
  }

  _searchStrings(requestedCommandName) {
    const stringCommands = this._strings
    const fuse = new Fuse(stringCommands, this.fuseOptions)
    return fuse.search(requestedCommandName)
  }

  _searchRegexps(requestedCommandName) {
    const regexpCommands = this._regexps
    // @TODO: include matches and captured groups
    return regexpCommands.filter(reg => requestedCommandName.match(reg.name))
  }

  search(requestedCommandName) {
    const matchedStrings = this._searchStrings(requestedCommandName)
    const matchedRegexps = this._searchRegexps(requestedCommandName)
    if (matchedStrings.length > 0) {
      return matchedStrings
    } else if (matchedRegexps.length > 0) {
      return matchedRegexps
    } else {
      return []
    }
  }

  getByName(name) {
    if (!name) throw new Error('Name is not specified')
    return this.commands.find(command =>
      command.name.toLowerCase() === name.toLowerCase()
    )
  }

  get length() {
    return this.commands.length
  }

  add(name, callback) {
    this.commands.push(new Command(name, callback))
  }

  flush() {
    this.commands = []
  }
}

class Command {
  constructor(name, callback) {
    if (name === undefined) throw new Error('Command name is not specified')
    this.name = name
    this.callback = callback
    this.type = this._defineCommandType(this.name)

    return this
  }

  _defineCommandType(name) {
    let type

    if (typeof name === 'string') {
      type = TYPE_STRING
    } else if (name instanceof RegExp) {
      type = TYPE_REGEXP
    } else if (Array.isArray(name)) {
      type = TYPE_ARRAY
    } else {
      throw new Error(`Command name is not of proper type.
        Could be only string, array of strings or regular expression`)
    }
    return type
  }
}

module.exports = Commands
module.exports.Command = Command
