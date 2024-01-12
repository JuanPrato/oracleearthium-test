import { and, eq } from "drizzle-orm";
import { channels, symbols } from "../db/schema";
import { db } from "../app";
import { prices } from "../caches/price.cache";

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
  symbol: string,
  price: string
) {
  if (!prices.has(symbol)) {
    await db.insert(symbols).values({
      symbol,
      value: price,
    });
  }
  return db.insert(channels).values({
    channel,
    guild,
    symbol,
  });
}
