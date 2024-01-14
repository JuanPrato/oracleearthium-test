import dotenv from "dotenv";
dotenv.config();

import { exit } from "node:process";
import path from "node:path";
import { app, client } from "./app";
import { loadRoutes, loadSlashCommands } from "./utils/loaders.util";
import express from "express";

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

app.use("/", express.static(path.join(__dirname, "../public")));

loadRoutes();

app.listen(3000, () => {
  console.log("Express ready on port: " + 3000);
});
