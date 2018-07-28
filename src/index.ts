import Alice from './alice'

/**
 * Для совместимости с commonjs
 * @example const Alice = require('yandex-dialogs-sdk')
 */
module.exports = Alice
exports = module.exports

export default Alice
export { default as Scene } from './scene'
export { default as reply } from './reply'
export { default as button } from './button'
export { default as ReplyBuilder } from './replyBuilder'
export { default as ButtonBuilder } from './buttonBuilder'
export { default as loggerMiddleware } from './middlewares/loggerMiddleware'
