import dotenv from "dotenv";
import { exit } from "node:process";
import { client, connection } from "./app";
import { loadSlashCommands } from "./utils/loaders.util";
import { drizzle } from "drizzle-orm/planetscale-serverless";

dotenv.config();

client
  .login(process.env.TOKEN)
  .then(() => {
    console.log("BOT READY");
    import("./events/interaction.event");
    loadSlashCommands(client);
  })
  .catch((e) => {
    console.error(`Invalid token=${process.env.TOKEN}`);
    console.log(e);
    exit(1);
  });

export const db = drizzle(connection);
