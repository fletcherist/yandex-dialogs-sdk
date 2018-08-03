import { IApiResponseCardButton } from '../../api/response';

export interface ICardButtonReply {
  text: string;
  url?: string;
  payload?: object;
}

export type CardButtonDeclaration = ICardButtonReply | string;

export class CardButtonBuilder {
  public static createCardButton(
    declaration: CardButtonDeclaration,
  ): IApiResponseCardButton {
    if (typeof declaration === 'object') {
      return declaration;
    }

    if (typeof declaration === 'string') {
      return {
        text: declaration,
        payload: { text: declaration },
      };
    }

    throw new Error(
      'Card button declaration is not of proper type. ' +
        'Could be only string or object.',
    );
  }
}
