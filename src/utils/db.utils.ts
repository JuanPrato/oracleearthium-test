import { and, eq } from "drizzle-orm";
import { bets, channels, configs, symbols } from "../db/schema";
import { db } from "../app";
import { prices } from "../caches/price.cache";
import { count } from "drizzle-orm";
import { Config } from "../caches/config.cache";
import { gt } from "drizzle-orm";
import day from "dayjs";

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

export async function saveOrUpdateConfig(guild: string, config: Config) {
  await db
    .insert(configs)
    .values({
      id: guild,
      adminRole: config.adminRoleId,
    })
    .onDuplicateKeyUpdate({
      set: {
        adminRole: config.adminRoleId,
      },
    });
}

export async function saveBet(bet: number, user: string, guild: string) {
  const prevBet = await db
    .select({ value: count() })
    .from(bets)
    .where(and(gt(bets.date, day().add(-1, "day").toDate())));

  if (prevBet[0]) {
    await db.update(bets).set({
      betAmount: bet,
    });
    return;
  }

  await db.insert(bets).values({
    betAmount: bet,
    guild,
    userId: user,
  });
  return true;
}
