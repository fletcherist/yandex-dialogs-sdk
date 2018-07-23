import Alice from './alice'
import Scene from './scene'

// fp
import reply from './reply'
import button from './button'

// for java-lovers
import ReplyBuilder from './replyBuilder'
import ButtonBuilder from './buttonBuilder'

import loggingMiddleware from './middlewares/loggingMiddleware'

module.exports = Alice
module.exports.default = Alice
module.exports.Alice = Alice
module.exports.Scene = Scene
module.exports.button = button
module.exports.reply = reply
module.exports.ButtonBuilder = ButtonBuilder
module.exports.ReplyBuilder = ReplyBuilder
module.exports.loggingMiddleware = loggingMiddleware
