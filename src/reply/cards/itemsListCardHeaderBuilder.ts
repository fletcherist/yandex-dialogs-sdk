import { IApiResponseItemsListCardHeader } from '../../api/response';

export interface IItemsListCardHeaderReply {
  text: string;
}

export type ItemsListCardHeaderDeclaration = IItemsListCardHeaderReply | string;

export class ItemsListCardHeaderBuilder {
  public static createItemsListCardHeader(
    declaration: ItemsListCardHeaderDeclaration,
  ): IApiResponseItemsListCardHeader {
    if (typeof declaration === 'object') {
      return declaration;
    }

    if (typeof declaration === 'string') {
      return {
        text: declaration,
      };
    }

    throw new Error(
      'Items list card header declaration is not of proper type. ' +
        'Could be only string or object.',
    );
  }
}
