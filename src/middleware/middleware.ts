import { Context } from '../context';

export type MiddlewareNext<TContext extends Context = Context> = (
  context: TContext,
) => Promise<TContext>;

export type Middleware<
  TContextFrom extends Context = Context,
  TContextTo extends Context = TContextFrom
> = (
  context: TContextFrom,
  next: MiddlewareNext<TContextTo> | null,
) => TContextTo | Promise<TContextTo>;
