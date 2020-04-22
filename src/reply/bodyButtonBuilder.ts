import { ApiResponseBodyButton } from '../api/response';

export interface IBodyButtonReply {
  title: string;
  url?: string;
  payload?: object;
  hide?: boolean;
}

export type BodyButtonDeclaration = IBodyButtonReply | string;

export class BodyButtonBuilder {
  public static createBodyButton(
    declaration: BodyButtonDeclaration,
  ): ApiResponseBodyButton {
    if (typeof declaration === 'object') {
      return declaration;
    }

    if (typeof declaration === 'string') {
      return {
        title: declaration,
      };
    }

    throw new Error(
      'Card button declaration is not of proper type. ' +
        'Could be only string or object.',
    );
  }
}
