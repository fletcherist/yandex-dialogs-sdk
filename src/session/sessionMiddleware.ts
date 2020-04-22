import { Middleware } from '../middleware/middleware';
import { SessionStorage } from './session';
import { Context } from '../context';
import { SessionContext } from './sessionContext';
import {
  ISessionKeyProvider,
  sessionKeyUserIdProvider,
} from './sessionKeyProvider';

interface ISessionMiddlewareParams {
  keyProvider?: ISessionKeyProvider;
}

/**
 * Uses data.session.session_id as a key
 * to store user sessions
 */
export function sessionMiddleware(
  storage: SessionStorage,
  { keyProvider = sessionKeyUserIdProvider }: ISessionMiddlewareParams = {},
): Middleware<SessionContext, Context> {
  return async (context, next): Promise<Context> => {
    const id = await keyProvider(context);
    const session = await storage.getOrCreate(id);
    const sessionContext: SessionContext = {
      ...context,
      session,
    };
    return next ? next(sessionContext) : sessionContext;
  };
}
