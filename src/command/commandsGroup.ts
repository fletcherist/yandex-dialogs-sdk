import { ICommand } from './command';

import { IContext } from '../context';

export interface ICommandRelevance<TContext extends IContext = IContext> {
  readonly command: ICommand<TContext>;
  readonly relevance: number;
}

export interface ICommandsGroup<TContext extends IContext = IContext> {
  add(command: ICommand): void;
  getRelevance(
    context: TContext,
  ): Promise<ICommandRelevance<TContext>[] | null>;
  getMostRelevant(context: TContext): Promise<ICommand<TContext> | null>;
}

export class CommandsGroup<TContext extends IContext = IContext>
  implements ICommandsGroup<TContext> {
  private readonly _commands: ICommand<TContext>[];

  constructor() {
    this._commands = [];
  }

  public async getRelevance(
    context: TContext,
  ): Promise<ICommandRelevance[] | null> {
    return Promise.all(
      this._commands.map(async command => {
        return { command, relevance: await command.getRelevance(context) };
      }),
    );
  }

  async getMostRelevant(context: TContext): Promise<ICommand<TContext> | null> {
    const relevances = await this.getRelevance(context);
    if (!relevances || !relevances.length) {
      return null;
    }

    const mostRelevant = relevances.reduce<ICommandRelevance<TContext>>(
      (last, current) => (current.relevance > last.relevance ? current : last),
      relevances[0],
    );
    return mostRelevant.relevance > 0 ? mostRelevant.command : null;
  }

  public add(command: ICommand<TContext>): void {
    this._commands.push(command);
  }
}
