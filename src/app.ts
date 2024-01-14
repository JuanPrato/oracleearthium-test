import { Client, GatewayIntentBits } from "discord.js";
import {
  loadCaches,
  loadCommands,
  loadEvents,
  loadRoutes,
} from "./utils/loaders.util";
import { exit } from "process";
import express from "express";
import { setBetScheduler, startRefreshValueTimer } from "./utils/timers.util";
import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

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

export let db: MySql2Database;

mysql
  .createConnection({
    uri: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  .then((con) => {
    db = drizzle(con);
  })
  .then(() => {
    loadCaches()
      .then(async () => {
        startRefreshValueTimer();
      })
      .catch((e) => {
        console.log(e);
        exit(3);
      });
  });

setBetScheduler();
