
import { IApiResponseItemsListCardImage } from "../../api/response";
import { CardButtonDeclaration, CardButtonBuilder } from "./cardButtonBuilder";

export interface IItemsListCardImageReply {
  image_id: string;
  title?: string;
  description?: string;
  button?: CardButtonDeclaration;
}

export type ItemsListCardImageDeclaration =
  IItemsListCardImageReply |
  string;

export class ItemsListCardImageBuilder {
  public static createItemsListCardImage(
    declaration: ItemsListCardImageDeclaration
  ): IApiResponseItemsListCardImage {
    if (typeof declaration === 'object') {
      const result: IApiResponseItemsListCardImage = {
        image_id: declaration.image_id,
        title: declaration.title,
        description: declaration.description,
      };
      if (declaration.button) {
        result.button = CardButtonBuilder.createCardButton(declaration.button);
      }
      return result;
    }

    if (typeof declaration === 'string') {
      return {
        image_id: declaration,
      };
    }

    throw new Error(
      'Items list card header declaration is not of proper type. ' +
      'Could be only string or object.');
  }
}

