import { and, eq } from "drizzle-orm";
import { channels } from "../db/schema";
import { db } from "../app";

export async function removeGuild(guild: string) {
  return db.delete(channels).where(eq(channels.guild, guild));
}

export async function removeChannel(guildId: string, channelId: string) {
  return db
    .delete(channels)
    .where(and(eq(channels.guild, guildId), eq(channels.channel, channelId)));
}

export async function saveNewChannel(
  channel: string,
  guild: string,
  symbol: string
) {
  db.insert(channels).values({
    channel,
    guild,
    symbol,
  });
}
