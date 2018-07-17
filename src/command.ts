import {
    TYPE_STRING,
    TYPE_FIGURE,
    TYPE_REGEXP,
    TYPE_ARRAY,
    TYPE_MATCHER,
} from './constants'
import Context from './context'
import {
    ICommand,
    CallbackType,
    CommandType,
    CommandNameType,
} from './types/command'
import { isFunction } from './utils'

export default class Command implements ICommand {
    public name: CommandNameType
    public type: CommandType
    public callback: CallbackType

    constructor(name: CommandNameType, callback: CallbackType) {
        if (name === undefined) { throw new Error('Command name is not specified') }
        this.name = name
        this.callback = callback
        this.type = this._defineCommandType(this.name)

        return this
    }

    public _defineCommandType(name) {
        let type

        if (isFunction(name)) {
            type = TYPE_MATCHER
        } else if (typeof name === 'string') {
            type = TYPE_STRING
            if (name.includes('${')) {
                type = TYPE_FIGURE
            }
        } else if (name instanceof RegExp) {
            type = TYPE_REGEXP
        } else if (Array.isArray(name)) {
            type = TYPE_ARRAY
        } else {
            throw new Error(`Command name is not of proper type.
                Could be only string, array of strings, regular expression or function`)
        }
        return type
    }
}
