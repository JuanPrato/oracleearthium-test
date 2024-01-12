import { commands } from "../caches/commands.cache";
import { readdirSync } from "node:fs";
import path from "node:path";

import type { Client } from "discord.js";
import { prices } from "../caches/price.cache";
import {
  channels as channelTable,
  configs as configTable,
  symbols as symbolTable,
} from "../db/schema";
import { configMap } from "../caches/config.cache";
import { priceChannels } from "../caches/price_channel.cache";
import { db } from "../app";

const EVENTS_DIR = "../events/";
const COMMANDS_DIR = "../commands/";
const ROUTES_DIR = "../routes/";

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

export const loadRoutes = async () => {
  const files = readdirSync(path.join(__dirname, ROUTES_DIR));

  for (const file of files) {
    import(path.join(__dirname, ROUTES_DIR, file));
    console.log(file, "loaded");
  }
};

export const loadCaches = async () => {
  const symbols = await db.select().from(symbolTable);

  for (const symbol of symbols) {
    prices.set(symbol.symbol, symbol.value);
  }

  const configs = await db.select().from(configTable);

  for (const config of configs) {
    configMap.set(config.id, {
      adminRoleId: config.adminRole,
      updateTime: config.updateTime,
    });
  }

  const channels = await db.select().from(channelTable);

  for (const channel of channels) {
    priceChannels.set(
      channel.guild!,
      channels
        .filter((c) => c.guild === channel.guild)
        .map((c) => ({
          channelId: c.channel!,
          symbol: c.symbol!,
        }))
    );
  }
};
