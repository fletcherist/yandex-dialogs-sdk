import { Middleware, IMiddlewareResult } from '../middleware/middleware';
import { ISessionStorage } from './session';
import { IContext } from '../context';
import { ISessionContext } from './sessionContext';

/**
 * Uses data.session.user_id as a key
 * to store user sessions
 */
export function userSessionMiddleware(
  storage: ISessionStorage,
): Middleware<ISessionContext, IContext> {
  return async (context, next): Promise<IMiddlewareResult | null> => {
    const id = context.data.session.user_id;
    const session = await storage.getOrCreate(id);
    const sessionContext: ISessionContext = {
      ...context,
      session,
    };
    return next ? next(sessionContext) : null;
  };
}
