import {
    TYPE_STRING,
    TYPE_FIGURE,
    TYPE_REGEXP,
    TYPE_ARRAY,
} from './constants'
import Ctx from './ctx'
import { CommandInterface, CallbackType, CommandType } from './types/command'
import { CtxInterface } from './types/ctx'

export default class Command implements CommandInterface {
    public name: any[] | string | RegExp
    public type: | CommandType
    public callback: CallbackType

    constructor(name: string, callback: CallbackType) {
        if (name === undefined) { throw new Error('Command name is not specified') }
        this.name = name
        this.callback = callback
        this.type = this._defineCommandType(this.name)

        return this
    }

    public _defineCommandType(name) {
        let type

        if (typeof name === 'string') {
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
            Could be only string, array of strings or regular expression`)
        }
        return type
    }
}
