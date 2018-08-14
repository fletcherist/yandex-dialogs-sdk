import { BodyButtonBuilder, BodyButtonDeclaration } from './bodyButtonBuilder';
import { IApiResponseBodyButton } from '../api/response';

export class Markup {
  public static button(
    declaration: BodyButtonDeclaration,
  ): IApiResponseBodyButton {
    return BodyButtonBuilder.createBodyButton(declaration);
  }
}
