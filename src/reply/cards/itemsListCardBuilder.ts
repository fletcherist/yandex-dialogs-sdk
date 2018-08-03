import { IApiResponseItemsListCard } from "../../api/response";
import { CardFooterDeclaration, CardFooterBuilder } from "./cardFooterBuilder";
import { ItemsListCardHeaderDeclaration, ItemsListCardHeaderBuilder } from "./itemsListCardHeaderBuilder";
import { ItemsListCardImageDeclaration, ItemsListCardImageBuilder } from "./itemsListCardImageBuilder";

export interface IItemsListCardReply {
  header?: ItemsListCardHeaderDeclaration;
  items: ItemsListCardImageDeclaration[];
  footer?: CardFooterDeclaration;
}

export type ItemsListCardDeclaration =
  IItemsListCardReply |
  ItemsListCardImageDeclaration[]

function isItemsListCard(
  declaration: ItemsListCardDeclaration
): declaration is IItemsListCardReply {
  return (<IItemsListCardReply>declaration).items !== undefined;
}

function isItemsListImageArray(
  declaration: ItemsListCardDeclaration
): declaration is ItemsListCardImageDeclaration[] {
  return Array.isArray(declaration);
}

export class ItemsListCardBuilder {
  public static createItemsListCard(
    declaration: ItemsListCardDeclaration
  ): IApiResponseItemsListCard {
    if (isItemsListImageArray(declaration)) {
      return {
        type: 'ItemsList',
        items: declaration.map(
            item => ItemsListCardImageBuilder.createItemsListCardImage(item)),
      }
    }

    if (isItemsListCard(declaration)) {
      declaration
      const result: IApiResponseItemsListCard = {
        type: 'ItemsList',
        items: declaration.items.map(
            item => ItemsListCardImageBuilder.createItemsListCardImage(item)),
      };
      if (declaration.footer) {
        result.footer = CardFooterBuilder.createCardFooter(declaration.footer);
      }
      if (declaration.header) {
        result.header = ItemsListCardHeaderBuilder.createItemsListCardHeader(
            declaration.header);
      }
      return result;
    }

    throw new Error(
      'Card button declaration is not of proper type. ' +
      'Could be only array or object.');
  }
}
