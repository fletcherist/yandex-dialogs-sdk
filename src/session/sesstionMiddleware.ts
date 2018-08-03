import {
  Middleware,
  IMiddlewareResult,
} from '../middleware/middleware'
import { ISessionStorage } from './session';
import { IContext } from '../context';
import { ISessionContext } from './sessionContext';


export function sessionMiddleware(
    storage: ISessionStorage
): Middleware<IContext, ISessionContext> {
  return async function(context, next): Promise<IMiddlewareResult | null> {
    const id = context.data.session.session_id;
    const session = await storage.getOrCreate(id);
    const sessionContext: ISessionContext = {
      ...context,
      session,
    };

    return next ? next(sessionContext) : null;
  }
}
