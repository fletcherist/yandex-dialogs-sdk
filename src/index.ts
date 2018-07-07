import Alice from './alice'
import Scene from './scene'

// fp
import reply from './reply'
import button from './button'

// for java-lovers
import ReplyBuilder from './replyBuilder'
import ButtonBuilder from './buttonBuilder'
// const button = require('./button')
// const reply = require('./reply')

export default Alice
export {
  Alice,
  Scene,
  button,
  reply,

  ButtonBuilder,
  ReplyBuilder,
}

module.exports = Alice
module.exports.Scene = Scene
module.exports.button = button
module.exports.reply = reply
module.exports.ButtonBuilder = ButtonBuilder
module.exports.ReplyBuilder = ReplyBuilder
