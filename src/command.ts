import {
    TYPE_STRING,
    TYPE_FIGURE,
    TYPE_REGEXP,
    TYPE_ARRAY,

    CommandType,
} from './constants'
import Ctx from './ctx'

const foo: 'bar' = 'bar'

export default class Command {
    public name: any[] | string | RegExp
    public callback: (ctx: Ctx) => void
    public type: | CommandType

    constructor(name: string, callback: (() => void)) {
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
