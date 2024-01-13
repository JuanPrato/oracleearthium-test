import { Colors, EmbedBuilder, Role } from "discord.js";
import { IAnswerable, ICommand } from "../types/command.type";
import { createSlashCommand } from "../utils/discord.util";
import { configMap } from "../caches/config.cache";
import { resetGuildBets, saveOrUpdateConfig } from "../utils/db.utils";

const ResetCommand: ICommand = {
  command: "reset",
  async run(message: IAnswerable, args): Promise<void> {
    if (message.member.guild.ownerId !== message.member.id) {
      await message.reply("User not authorize to modify config");
      return;
    }

    await resetGuildBets(message.channel.guildId);

    await message.reply("LeaderBoard restarted");
  },
  slashCommand: createSlashCommand("reset", "reset leaderBoard"),
  slashArgsParser: (args) => {
    return args.map((a) => a.value) as string[];
  },
  argsParser(args: any) {
    return args;
  },
};

export default ResetCommand;
