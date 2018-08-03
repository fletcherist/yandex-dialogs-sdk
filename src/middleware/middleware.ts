import { IContext } from '../context';
import { IApiResponseBody } from '../api/response';

export type IMiddlewareResult = {
  responseBody: IApiResponseBody;
};

export type MiddlewareNext<TContext extends IContext = IContext> = (
  context: TContext,
) => Promise<IMiddlewareResult | null>;

export type Middleware<
  TContextFrom extends IContext = IContext,
  TContextTo extends IContext = TContextFrom
> = (
  context: TContextFrom,
  next: MiddlewareNext<TContextTo> | null,
) => IMiddlewareResult | Promise<IMiddlewareResult | null>;
