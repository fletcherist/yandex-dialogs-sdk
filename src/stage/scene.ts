import {
  Command,
  CommandCallback,
  CommandDeclaration,
  CommandCallbackResult,
} from '../command/command';
import { CommandsGroup } from '../command/commandsGroup';
import { Context } from '../context';

export class Scene {
  public readonly name: string;
  private readonly _commands: CommandsGroup;
  private _anyCommand: Command | null;

  constructor(name: string) {
    this.name = name;
    this._anyCommand = null;
    this._commands = new CommandsGroup();
  }

  public command(
    declaration: CommandDeclaration,
    callback: CommandCallback,
  ): void {
    this._commands.add(Command.createCommand(declaration, callback));
  }

  public any(callback: CommandCallback): void {
    this._anyCommand = new Command(Command.createMatcherAlways(), callback);
  }

  public async run(context: Context): Promise<CommandCallbackResult | null> {
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
