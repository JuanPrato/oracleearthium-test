import dotenv from "dotenv";
import { exit } from "node:process";
import { app, client } from "./app";
import { loadSlashCommands } from "./utils/loaders.util";
import express from "express";
import { connect } from "@planetscale/database";

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

export const connection = connect({
  url: process.env.DATABASE_URL,
});

app.use("/", express.static(__dirname + "/public"));

app.listen(3000, () => {
  console.log("Express ready on port: " + 3000);
});
