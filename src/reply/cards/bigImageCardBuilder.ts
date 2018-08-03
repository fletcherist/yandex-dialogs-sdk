import { IApiResponseBigImageCard } from "../../api/response";
import { CardFooterDeclaration, CardFooterBuilder } from "./cardFooterBuilder";
import { CardButtonDeclaration, CardButtonBuilder } from "./cardButtonBuilder";

export interface IBigImageCardReply {
  image_id: string;
  title?: string;
  description?: string;
  button?: CardButtonDeclaration;
  footer?: CardFooterDeclaration;
}

export type BigImageCardDeclaration =
  IBigImageCardReply |
  string;

export class BigImageCardBuilder {
  public static createBigImageCard(
    declaration: BigImageCardDeclaration
  ): IApiResponseBigImageCard {
    if (typeof declaration === 'object') {
      const result: IApiResponseBigImageCard = {
        type: 'BigImage',
        image_id: declaration.image_id,
        title: declaration.title,
        description: declaration.description,
      };
      if (declaration.button) {
        result.button = CardButtonBuilder.createCardButton(declaration.button);
      }
      if (declaration.footer) {
        result.footer = CardFooterBuilder.createCardFooter(declaration.footer);
      }
      return result;
    }

    if (typeof declaration === 'string') {
      return {
        type: 'BigImage',
        image_id: declaration,
      };
    }

    throw new Error(
      'Big image card declaration is not of proper type. ' +
      'Could be only string or object.');
  }
}
