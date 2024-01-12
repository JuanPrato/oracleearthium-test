import { Colors, EmbedBuilder, Role } from "discord.js";
import { IAnswerable, ICommand } from "../types/command.type";
import { createSlashCommand } from "../utils/discord.util";
import { configMap } from "../caches/config.cache";
import { saveOrUpdateConfig } from "../utils/db.utils";

interface Args {
  field: string;
  mention: Role;
}

const ConfigCommand: ICommand<Args> = {
  command: "config",
  async run(message: IAnswerable, args): Promise<void> {
    if (message.member.guild.ownerId !== message.member.id) {
      await message.reply("User not authorize to modify config");
      return;
    }

    const role = args.mention;

    const guild = message.member.guild.id;

    let config = configMap.get(guild);

    if (!config) {
      config = {
        adminRoleId: role.id,
        updateTime: 0,
      };
    } else {
      config.adminRoleId = role.id;
    }

    await saveOrUpdateConfig(guild, config);

    await message.reply(`CONFIGURATION SAVED:
    role: ${role}`);
  },
  slashCommand: createSlashCommand("config", "config admin command", [
    {
      name: "field",
      type: "string",
      required: true,
    },
    {
      name: "value",
      type: "mention",
      required: true,
    },
  ]),
  slashArgsParser: (args) => {
    return {
      field: args.find((a) => a.name === "field")!.value as string,
      mention: args.find((a) => a.name === "value")!.role as Role,
    };
  },
  argsParser(args: any) {
    return args;
  },
};

export default ConfigCommand;
