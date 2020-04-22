import { Context } from '../context';

export type ISessionKeyProvider<TContext extends Context = Context> = (
  context: TContext,
) => Promise<string> | string;

export function sessionKeySessionIdProvider<TContext extends Context = Context>(
  context: TContext,
) {
  return context.data.session.session_id;
}

export function sessionKeyUserIdProvider<TContext extends Context = Context>(
  context: TContext,
) {
  return context.data.session.user_id;
}
