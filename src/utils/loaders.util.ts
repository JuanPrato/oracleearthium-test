import { commands } from "../caches/commands.cache";
import { readdirSync } from "node:fs";
import path from "node:path";

import type { Client } from "discord.js";

const EVENTS_DIR = "../events/";
const COMMANDS_DIR = "../commands/";

export const loadEvents = (): void => {
  const files = readdirSync(path.join(__dirname, EVENTS_DIR));

  for (const file of files) {
    import(path.join(__dirname, EVENTS_DIR, file));
    console.log(file, "loaded");
  }
};

export const loadCommands = async (): Promise<void> => {
  const files = readdirSync(path.join(__dirname, COMMANDS_DIR));
  for (const file of files) {
    if (file.includes("type")) continue;
    const command = await import(path.join(__dirname, COMMANDS_DIR, file));
    console.log(command.default.command, "loaded");
    commands.set(command.default.command, command.default);
  }
};

export const loadSlashCommands = async (client: Client) => {
  for (const [guildId, guild] of client.guilds.cache) {
    for (const [commandName, command] of commands) {
      await guild.commands.create(command.slashCommand);
    }
  }
};
