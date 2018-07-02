import { merge } from 'ramda'
import Ctx from './ctx'

export type MiddlewareType = (ctx: Ctx) => Ctx
export async function applyMiddleware(middleware: MiddlewareType, ctx: Ctx): Promise<Ctx> {
  const newContext = await middleware(ctx)
  if (!newContext) {
    throw new Error('Your middleware function should always return Ctx')
  }
  return newContext
}

export async function applyMiddlewares(middlewares, ctx: Ctx): Promise<Ctx> {
  let newContext = ctx
  for (const middleware of middlewares) {
    try {
      newContext = await applyMiddleware(middleware, newContext)
    } catch (error) {
      throw new Error(error)
    }
  }
  return newContext
}

export function createAliceStateMiddleware() {
  const store = new Map()

  return async (ctx) => {
    const key = ctx.session.sessionId
    let { state } = store.get(key) || { state: {} }
    Object.defineProperty(ctx, 'state', {
      get() { return state },
      set(value) { state = Object.assign({}, value) },
    })
    store.set(key, {
      state,
    })

    return ctx
  }
}
