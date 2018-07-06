import ReplyBuilder from './replyBuilder'
import ButtonBuilder from './buttonBuilder'
import Alice from './alice'
const Scene = require('./scene')

// fp
const button = require('./button')
const reply = require('./reply')

// for java-lovers
const buttonBuilder = require('./buttonBuilder')
// const replyBuilder = require('./replyBuilder')

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
