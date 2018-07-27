export default function aliceStateMiddleware() {
    const store = new Map()

    return async ctx => {
        const key = ctx.session.sessionId
        let { state } = store.get(key) || { state: {} }
        Object.defineProperty(ctx, 'state', {
            get() {
                return state
            },
            set(value) {
                state = Object.assign({}, value)
            },
        })
        store.set(key, {
            state,
        })

        return ctx
    }
}
