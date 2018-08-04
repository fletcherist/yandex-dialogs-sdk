import {
  Command,
  CommandCallback,
  CommandDeclaration,
  CommandCallbackResult,
} from '../command/command';
import { ICommandsGroup, CommandsGroup } from '../command/commandsGroup';

import { IStageContext } from './stageContext';

export interface IScene<TContext extends IStageContext = IStageContext> {
  readonly name: string;
  command(
    declaration: CommandDeclaration<TContext>,
    callback: CommandCallback<TContext>,
  );
  any(callback: CommandCallback<TContext>);
  run(context: TContext): Promise<CommandCallbackResult>;
}

export class Scene<TContext extends IStageContext = IStageContext>
  implements IScene<TContext> {
  public readonly name: string;
  private readonly _commands: ICommandsGroup<TContext>;
  private _anyCommand: Command<TContext> | null;

  constructor(name: string) {
    this.name = name;
    this._anyCommand = null;
    this._commands = new CommandsGroup();
  }

  public command(
    declaration: CommandDeclaration<TContext>,
    callback: CommandCallback<TContext>,
  ): void {
    this._commands.add(Command.createCommand(declaration, callback));
  }

  public any(callback: CommandCallback<TContext>): void {
    this._anyCommand = new Command(Command.createMatcherAlways(), callback);
  }

  private async run(context: TContext): Promise<CommandCallbackResult> {
    const command = await this._commands.getMostRelevant(context);
    if (command) {
      return command.run(context);
    }

    if (this._anyCommand) {
      return this._anyCommand.run(context);
    }

    return null;
  }
}

module.exports = Scene;
