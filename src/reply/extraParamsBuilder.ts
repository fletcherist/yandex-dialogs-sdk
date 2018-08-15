import { IApiResponseBodyButton } from '../api/response';
import { BodyButtonDeclaration } from './bodyButtonBuilder';
import { BodyButtonBuilder } from './bodyButtonBuilder';

export interface IExtraParams {
  tts?: string;
  buttons?: IApiResponseBodyButton[];
  end_session: boolean;
}

export interface IExtraParamsReply {
  tts?: string;
  buttons?: BodyButtonDeclaration[];
  end_session?: boolean;
}

export type ExtraParamsDeclaration = IExtraParamsReply;

export class ExtraParamsBuilder {
  public static createExtraParams(
    declaration: ExtraParamsDeclaration,
  ): IExtraParams {
    if (typeof declaration === 'object') {
      return {
        buttons:
          declaration.buttons &&
          declaration.buttons.map(button =>
            BodyButtonBuilder.createBodyButton(button),
          ),
        end_session: Boolean(declaration.end_session),
        tts: declaration.tts,
      };
    }

    throw new Error(
      'Card button declaration is not of proper type. ' +
        'Could be only string or object.',
    );
  }
}
