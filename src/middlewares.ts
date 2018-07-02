import { merge } from 'ramda'
import Ctx from './ctx'

export type MiddlewareType = (ctx: Ctx) => Ctx
export async function applyMiddleware(middleware: MiddlewareType, ctx: Ctx): Promise<Ctx> {
    const newContext = await middleware(ctx)
    if (!newContext) {
        throw new Error('Your middleware function should always return Ctx')
    }
    console.log('MIDDLEWAFER ACCEPTED')
    return merge(ctx, newContext)
}

export async function applyMiddlewares(middlewares, ctx: Ctx): Promise<Ctx> {
    let newContext = ctx
    for (const middleware of middlewares) {
        try {
            newContext = await applyMiddleware(middleware, newContext)
            console.log('applied middleware 222222', middleware)
        } catch (error) {
            throw new Error(error)
        }
    }
    console.log('1231232131203129310923091209312')
    return newContext
}
