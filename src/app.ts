import { Client, GatewayIntentBits } from "discord.js";
import { loadCommands, loadEvents } from "./utils/loaders.util";
import { exit } from "process";
import { connect } from "@planetscale/database";
import express from "express";

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

export const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

loadEvents();
loadCommands().catch((e) => {
  console.log(e);
  exit(2);
});

export const app = express();
