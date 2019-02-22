import { IContext } from '../context';
import { IApiResponseBody } from '../api/response';


export type MiddlewareNext<TContext extends IContext = IContext> = (
  context: TContext,
) => Promise<IApiResponseBody | null>;

export type Middleware<
  TContextFrom extends IContext = IContext,
  TContextTo extends IContext = TContextFrom
> = (
  context: TContextFrom,
  next: MiddlewareNext<TContextTo> | null,
) => IApiResponseBody | Promise<IApiResponseBody | null>;
