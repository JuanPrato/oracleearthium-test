import { client } from "../app";
import { commands } from "../caches/commands.cache";
import { ICommandException, isAnswerable } from "../types/command.type";

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.inGuild()) return;

  const prefix: string = process.env.PREFIX ?? "-";
  if (!message.content.startsWith(prefix)) return;

  const commandName = message.content.slice(prefix.length).split(" ")[0];
  const command = commands.get(commandName);

  if (command === null || command === undefined) return;

  let args = message.content.split(" ");
  args.shift();

  try {
    if (command.argsParser !== undefined) {
      args = command.argsParser(args);
    }
    if (isAnswerable(message)) {
      await command.run(message, args);
    }
  } catch (e) {
    await message.reply((e as ICommandException).message);
  }
});
