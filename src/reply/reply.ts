import { IApiResponseBody } from '../api/response';
import { TextReplyDeclaration, TextReplyBuilder } from './textReplyBuilder';
import {
  ExtraParamsDeclaration,
  ExtraParamsBuilder,
} from './extraParamsBuilder';
import {
  BigImageCardDeclaration,
  BigImageCardBuilder,
} from './cards/bigImageCardBuilder';
import {
  ItemsListCardDeclaration,
  ItemsListCardBuilder,
} from './cards/itemsListCardBuilder';

export class Reply {
  public static text(
    textDeclaration: TextReplyDeclaration,
    extraParamsDeclaration?: ExtraParamsDeclaration,
  ): IApiResponseBody {
    const textReply = TextReplyBuilder.createTextReply(textDeclaration);
    const result: IApiResponseBody = {
      text: textReply.text,
      tts: textReply.tts,
      end_session: false,
    };
    if (extraParamsDeclaration) {
      const extraParams = ExtraParamsBuilder.createExtraParams(
        extraParamsDeclaration,
      );
      if (extraParams.tts) {
        result.tts = extraParams.tts;
      }
      if (extraParams.buttons) {
        result.buttons = extraParams.buttons;
      }
      if (typeof extraParams.end_session !== 'undefined') {
        result.end_session = extraParams.end_session;
      }
    }
    return result;
  }

  public static bigImageCard(
    textDeclaration: TextReplyDeclaration,
    cardDeclaration: BigImageCardDeclaration,
    extraParamsDeclaration?: ExtraParamsDeclaration,
  ): IApiResponseBody {
    const textReply = TextReplyBuilder.createTextReply(textDeclaration);
    const card = BigImageCardBuilder.createBigImageCard(cardDeclaration);
    const result: IApiResponseBody = {
      text: textReply.text,
      tts: textReply.tts,
      card: card,
      end_session: false,
    };
    if (extraParamsDeclaration) {
      const extraParams = ExtraParamsBuilder.createExtraParams(
        extraParamsDeclaration,
      );
      if (extraParams.buttons) {
        result.buttons = extraParams.buttons;
      }
      if (typeof extraParams.end_session !== 'undefined') {
        result.end_session = extraParams.end_session;
      }
    }
    return result;
  }

  public static itemsListCard(
    textDeclaration: TextReplyDeclaration,
    cardDeclaration: ItemsListCardDeclaration,
    extraParamsDeclaration?: ExtraParamsDeclaration,
  ): IApiResponseBody {
    const textReply = TextReplyBuilder.createTextReply(textDeclaration);
    const card = ItemsListCardBuilder.createItemsListCard(cardDeclaration);
    const result: IApiResponseBody = {
      text: textReply.text,
      tts: textReply.tts,
      card: card,
      end_session: false,
    };
    if (extraParamsDeclaration) {
      const extraParams = ExtraParamsBuilder.createExtraParams(
        extraParamsDeclaration,
      );
      if (extraParams.buttons) {
        result.buttons = extraParams.buttons;
      }
      if (extraParams.end_session) {
        result.end_session = extraParams.end_session;
      }
    }
    return result;
  }
}
