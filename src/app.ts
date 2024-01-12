import { Client, GatewayIntentBits } from "discord.js";
import {
  loadCaches,
  loadCommands,
  loadEvents,
  loadRoutes,
} from "./utils/loaders.util";
import { exit } from "process";
import { connect } from "@planetscale/database";
import express from "express";
import {
  startRefreshValueTimer,
  updateChannelsValues,
} from "./utils/timers.util";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connection } from ".";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildModeration,
  ],
});

loadEvents();
loadCommands().catch((e) => {
  console.log(e);
  exit(2);
});

export const app = express();

export const db = drizzle(connection);

loadRoutes();
loadCaches().then(async () => {
  startRefreshValueTimer();
});
