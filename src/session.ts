export default class Session {
    public sessionId: string
    public data: {}
    constructor(sessionId: string, data = {}) {
        if (!sessionId) {
            throw new Error('Cant create new session. Missed {sessionId}')
        }
        this.sessionId = sessionId
        this.data = data
    }

    public get() {
        return Object.freeze({
            sessionId: this.sessionId,
            data: this.data,
        })
    }

    public getData(key) {
        return this.data[key]
    }

    public set(data) {
        if (typeof data !== 'object') {
            throw new Error(`Can't set data. Data should be an object`)
        }
        this.data = data
    }

    public setData(key, value) {
        this.data[key] = value
    }

    public update(data) {
        this.data = Object.assign(this.data, data)
    }
}
