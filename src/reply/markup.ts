import { BodyButtonBuilder, BodyButtonDeclaration } from './bodyButtonBuilder';
import { ApiResponseBodyButton } from '../api/response';

export class Markup {
  public static button(
    declaration: BodyButtonDeclaration,
  ): ApiResponseBodyButton {
    return BodyButtonBuilder.createBodyButton(declaration);
  }
}
