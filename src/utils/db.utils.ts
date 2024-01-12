import { and, eq } from "drizzle-orm";
import { channels, symbols } from "../db/schema";
import { db } from "../app";
import { prices } from "../caches/price.cache";
import { count } from "drizzle-orm";

export async function removeGuild(guild: string) {
  return db.delete(channels).where(eq(channels.guild, guild));
}

export async function removeChannel(guildId: string, channelId: string) {
  return db
    .delete(channels)
    .where(and(eq(channels.guild, guildId), eq(channels.channel, channelId)));
}

export async function checkAndDeleteUnusedSymbol(symbol: string) {
  const q = await db
    .select({ count: count() })
    .from(channels)
    .where(eq(channels.symbol, symbol));

  if (q[0]?.count === 0) {
    await db.delete(symbols).where(eq(symbols.symbol, symbol));
  }
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
