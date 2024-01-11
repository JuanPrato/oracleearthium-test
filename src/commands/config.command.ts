import { Colors, EmbedBuilder } from "discord.js";
import { IAnswerable, ICommand } from "../types/command.type";
import { createSlashCommand } from "../utils/discord.util";

interface Args {}

const ConfigCommand: ICommand<Args> = {
  command: "config",
  async run(message: IAnswerable, args): Promise<void> {},
  slashCommand: createSlashCommand("config", "config admin command"),
  slashArgsParser: function (args: any[]) {
    return {};
  },
  argsParser(args: any) {
    return args;
  },
};

export default ConfigCommand;
