import { merge } from 'ramda'
import Context from './context'

export type MiddlewareType = (ctx: Context) => Context
export async function applyMiddleware(middleware: MiddlewareType, ctx: Context): Promise<Context> {
  const newContext = await middleware(ctx)
  if (!newContext) {
    throw new Error('Your middleware function should always return Context')
  }
  return newContext
}

export async function applyMiddlewares(middlewares, ctx: Context): Promise<Context> {
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
