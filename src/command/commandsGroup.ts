import { Command } from './command';
import { Context } from '../context';

export interface CommandRelevance {
  readonly command: Command;
  readonly relevance: number;
}

export class CommandsGroup {
  private readonly _commands: Command[];

  constructor() {
    this._commands = [];
  }

  public async getRelevance(
    context: Context,
  ): Promise<CommandRelevance[] | null> {
    return Promise.all(
      this._commands.map(async command => {
        return { command, relevance: await command.getRelevance(context) };
      }),
    );
  }

  public async getMostRelevant(context: Context): Promise<Command | null> {
    const relevances = await this.getRelevance(context);
    if (!relevances || !relevances.length) {
      return null;
    }

    const mostRelevant = relevances.reduce<CommandRelevance>(
      (last, current) => (current.relevance > last.relevance ? current : last),
      relevances[0],
    );
    return mostRelevant.relevance > 0 ? mostRelevant.command : null;
  }

  public add(command: Command): void {
    this._commands.push(command);
  }
}
