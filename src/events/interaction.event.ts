import { Events, GuildMember, TextChannel } from "discord.js";
import { client } from "../app";
import { commands } from "../caches/commands.cache";
import { ICommandException, isAnswerable } from "../types/command.type";
import { createEmbedWithText } from "../utils/discord.util";

// COMMANDS HANDLER
client.on(Events.InteractionCreate, async (i) => {
  if (!i.isCommand() || !i.inGuild()) return;

  const command = commands.get(i.commandName);

  if (command === null || command === undefined) return;

  try {
    const args = command.slashArgsParser(i.options.data);
    if (isAnswerable(i)) {
      await command.run(i, args);
    }
  } catch (e) {
    console.error(e);
    if (i.replied) {
      await (i.channel as TextChannel).send({
        embeds: [createEmbedWithText((e as ICommandException).message)],
      });
    } else {
      await i.reply({
        embeds: [createEmbedWithText((e as ICommandException).message)],
        ephemeral: true,
      });
    }
  }
});
