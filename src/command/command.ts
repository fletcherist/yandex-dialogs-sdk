import { Context } from '../context';
import { ApiResponseBody } from '../api/response';
import {
  ITextRelevanceProvider,
  getLevenshteinRelevance,
} from '../utils/textRelevance';

export type CommandCallbackResult = ApiResponseBody;
export type CommandCallback =
  | ((context: Context) => CommandCallbackResult)
  | ((context: Context) => Promise<CommandCallbackResult>);
export type CommandMatcher =
  | ((ctx: Context) => boolean | number)
  | ((ctx: Context) => Promise<boolean | number>);
export type CommandDeclaration = CommandMatcher | string[] | string | RegExp;

interface CreateMatcherFromStringParams {
  relevanceProvider?: ITextRelevanceProvider;
}

export class Command {
  private readonly _callback: CommandCallback;
  private readonly _matcher: CommandMatcher;

  constructor(matcher: CommandMatcher, callback: CommandCallback) {
    this._matcher = matcher;
    this._callback = callback;
  }

  public async getRelevance(context: Context): Promise<number> {
    return this._matcher.call(null, context);
  }

  public async run(context: Context): Promise<CommandCallbackResult> {
    return this._callback.call(null, context);
  }

  public static createCommand(
    declaration: CommandDeclaration,
    callback: CommandCallback,
  ): Command {
    if (typeof declaration === 'function') {
      return new Command(declaration, callback);
    }

    if (typeof declaration === 'string') {
      return new Command(this.createMatcherFromString(declaration), callback);
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

  public static createMatcherFromString(
    pattern: string,
    params: CreateMatcherFromStringParams = {},
  ): CommandMatcher {
    if (typeof pattern === undefined) {
      return () => 0;
    }

    pattern = pattern ? pattern.toLowerCase() : '';
    const { relevanceProvider = getLevenshteinRelevance } = params;
    return (context: Context) => {
      const commandLower = context.data.request.command
        ? context.data.request.command.toLowerCase()
        : '';
      if (commandLower === pattern) {
        return 1;
      }
      return relevanceProvider(pattern, commandLower);
    };
  }

  public static createMatcherFromStrings(
    patterns: string[],
    params: CreateMatcherFromStringParams = {},
  ): CommandMatcher {
    if (!patterns || !patterns.length) {
      return () => 0;
    }

    patterns = patterns.map(s => s.toLowerCase());
    const { relevanceProvider = getLevenshteinRelevance } = params;
    return (context: Context) => {
      const commandLower = context.data.request.command
        ? context.data.request.command.toLowerCase()
        : '';
      return patterns.reduce(
        (r, pattern) => Math.max(r, relevanceProvider(pattern, commandLower)),
        0,
      );
    };
  }

  public static createMatcherFromRegExp(regexp: RegExp): CommandMatcher {
    return (context: Context) => {
      const commandLower = context.data.request.command
        ? context.data.request.command.toLowerCase()
        : '';
      return regexp.test(commandLower) ? 1 : 0;
    };
  }

  public static createMatcherAlways(): CommandMatcher {
    return () => 1;
  }

  public static createMatcherNever(): CommandMatcher {
    return () => 0;
  }
}
