import { IContext } from '../context';
import { IApiResponseBody } from '../api/response';

export type CommandCallbackResult = IApiResponseBody;
export type CommandCallback<TContext extends IContext = IContext> =
  | ((context: TContext) => CommandCallbackResult)
  | ((context: TContext) => Promise<CommandCallbackResult>);
export type CommandMatcher<TContext extends IContext = IContext> =
  | ((ctx: TContext) => boolean | number)
  | ((ctx: TContext) => Promise<boolean | number>);
export type CommandDeclaration<TContext extends IContext = IContext> =
  | CommandMatcher<TContext>
  | string[]
  | string
  | RegExp;

export interface ICommand<TContext extends IContext = IContext> {
  run(context: TContext): Promise<CommandCallbackResult>;
  getRelevance(context: TContext): Promise<number>;
}

export class Command<TContext extends IContext = IContext>
  implements ICommand<TContext> {
  private readonly _callback: CommandCallback<TContext>;
  private readonly _matcher: CommandMatcher;

  constructor(matcher: CommandMatcher, callback: CommandCallback<TContext>) {
    this._matcher = matcher;
    this._callback = callback;
  }

  public async getRelevance(context: IContext): Promise<number> {
    return this._matcher.call(null, context);
  }

  public async run(context: TContext): Promise<CommandCallbackResult> {
    return this._callback.call(null, context);
  }

  public static createCommand<TContext extends IContext = IContext>(
    declaration: CommandDeclaration,
    callback: CommandCallback<TContext>,
  ): ICommand<TContext> {
    if (typeof declaration === 'function') {
      return new Command(declaration, callback);
    }

    if (typeof declaration === 'string') {
      return new Command(
        this.createMatcherFromStrings([declaration]),
        callback,
      );
    }

    if (Array.isArray(declaration)) {
      return new Command(this.createMatcherFromStrings(declaration), callback);
    }

    if (declaration instanceof RegExp) {
      return new Command(this.createMatcherFromRegExp(declaration), callback);
    }

    throw new Error(
      'Command declaration is not of proper type. ' +
        'Could be only string, array of strings, RegExp or function.',
    );
  }

  public static createMatcherFromStrings(strings: string[]): CommandMatcher {
    if (!strings || !strings.length) {
      return () => 0;
    }

    const lowerStrings = strings.map(s => s.toLowerCase());
    return (context: IContext) => {
      const commandText = context.data.request.command;
      const lowerMessage = commandText ? commandText.toLowerCase() : '';
      return lowerStrings.some(s => s === lowerMessage) ? 1 : 0;
    };
  }

  public static createMatcherFromRegExp(regexp: RegExp): CommandMatcher {
    return (context: IContext) => {
      const commandText = context.data.request.command;
      const lowerMessage = commandText ? commandText.toLowerCase() : '';
      return regexp.test(lowerMessage) ? 1 : 0;
    };
  }

  public static createMatcherAlways(): CommandMatcher {
    return () => 1;
  }

  public static createMatcherNever(): CommandMatcher {
    return () => 0;
  }
}
