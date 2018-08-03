import { IApiResponseBodyButton } from "../api/response";
import { BodyButtonDeclaration } from "./bodyButtonBuilder";

export interface IExtraParams {
  buttons?: IApiResponseBodyButton[];
  end_session?: boolean;
}

export interface IExtraParamsReply {
  buttons?: BodyButtonDeclaration[];
  end_session?: boolean;
}

export type ExtraParamsDeclaration = IExtraParamsReply;

export class ExtraParamsBuilder {
  public static createExtraParams(
    declaration: ExtraParamsDeclaration
  ): IExtraParams {
    if (typeof declaration === 'object') {
      return {

        end_session: declaration.end_session,
      };
    }

    throw new Error(
      'Card button declaration is not of proper type. ' +
      'Could be only string or object.');
  }
}
