import { Middleware } from '../middleware/middleware';
import { ISessionStorage } from './session';
import { IContext } from '../context';
import { ISessionContext } from './sessionContext';
import { IApiResponseBody } from '../api/response'
import {
  ISessionKeyProvider,
  sessionKeyUserIdProvider,
} from './sessionKeyProvider';

interface ISessionMiddlewareParams {
  keyProvider?: ISessionKeyProvider
};

/**
 * Uses data.session.session_id as a key
 * to store user sessions
 */
export function sessionMiddleware(
  storage: ISessionStorage,
  {
    keyProvider = sessionKeyUserIdProvider,
  }: ISessionMiddlewareParams = {},
): Middleware<ISessionContext, IContext> {
  return async (context, next): Promise<IApiResponseBody | null> => {
    const id = await keyProvider(context);
    const session = await storage.getOrCreate(id);
    const sessionContext: ISessionContext = {
      ...context,
      session,
    };
    return next ? next(sessionContext) : null;
  };
}
