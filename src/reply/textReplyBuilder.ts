export interface ITextReply {
  text: string;
  tts?: string;
}

export type TextReplyDeclaration = ITextReply | string;

export class TextReplyBuilder {
  public static createTextReply(declaration: TextReplyDeclaration): ITextReply {
    if (typeof declaration === 'object') {
      return declaration;
    }

    if (typeof declaration === 'string') {
      return { text: declaration };
    }

    throw new Error(
      'Text reply declaration is not of proper type. ' +
        'Could be only string or object.',
    );
  }
}
