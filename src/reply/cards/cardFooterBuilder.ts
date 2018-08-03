import { IApiResponseCardFooter } from '../../api/response';
import { CardButtonDeclaration, CardButtonBuilder } from './cardButtonBuilder';

export interface ICardFooterReply {
  text: string;
  button?: CardButtonDeclaration;
}

export type CardFooterDeclaration = ICardFooterReply | string;

export class CardFooterBuilder {
  public static createCardFooter(
    declaration: CardFooterDeclaration,
  ): IApiResponseCardFooter {
    if (typeof declaration === 'object') {
      const result: IApiResponseCardFooter = {
        text: declaration.text,
      };
      if (declaration.button) {
        result.button = CardButtonBuilder.createCardButton(declaration.button);
      }
      return result;
    }

    if (typeof declaration === 'string') {
      return {
        text: declaration,
      };
    }

    throw new Error(
      'Card footer declaration is not of proper type. ' +
        'Could be only string or object.',
    );
  }
}
