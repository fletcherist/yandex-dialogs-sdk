import { IContext } from '../context';

export type ISessionKeyProvider<TContext extends IContext = IContext> = (
  context: TContext,
) => Promise<string> | string;

export function sessionKeySessionIdProvider<TContext extends IContext = IContext>(
  context: TContext,
) {
  return context.data.session.session_id;
}

export function sessionKeyUserIdProvider<TContext extends IContext = IContext>(
  context: TContext,
) {
  return context.data.session.user_id;
}
