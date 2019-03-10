import { IContext } from '../context';

export type MiddlewareNext<TContext extends IContext = IContext> = (
  context: TContext,
) => Promise<TContext>;

export type Middleware<
  TContextFrom extends IContext = IContext,
  TContextTo extends IContext = TContextFrom
> = (
  context: TContextFrom,
  next: MiddlewareNext<TContextTo> | null,
) => TContextTo | Promise<TContextTo>;
