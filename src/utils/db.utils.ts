import { and, eq } from "drizzle-orm";
import { bets, channels, configs, symbols } from "../db/schema";
import { db } from "../app";
import { prices } from "../caches/price.cache";
import { count } from "drizzle-orm";
import { Config } from "../caches/config.cache";
import { gt } from "drizzle-orm";
import day from "dayjs";
import { gte } from "drizzle-orm";
import { lte } from "drizzle-orm";
import { sum } from "drizzle-orm";

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

export async function saveBet(
  bet: number,
  user: string,
  guild: string,
  symbol: string
) {
  const prevBet = await db
    .select({ value: count() })
    .from(bets)
    .where(
      and(
        gt(bets.date, day().startOf("day").toDate()),
        eq(bets.userId, user),
        eq(bets.symbol, symbol)
      )
    );
  if (prevBet[0].value !== 0) {
    await db.update(bets).set({
      betAmount: bet,
    });
    return;
  }

  await db.insert(bets).values({
    betAmount: bet,
    guild,
    userId: user,
    symbol,
  });
  return true;
}

export async function getBetsGroupBySymbol() {
  const savedBets = await db
    .select()
    .from(bets)
    .where(gte(bets.date, day().add(-1, "day").startOf("day").toDate()));
  return savedBets.reduce((acc, bet) => {
    if (!acc.has(bet.guild)) {
      acc.set(bet.guild, new Map());
    }
    if (!acc.get(bet.guild)?.has(bet.symbol)) {
      acc.get(bet.guild)?.set(bet.guild, []);
    }
    acc.get(bet.guild)?.get(bet.symbol)?.push({
      user: bet.userId,
      bet: bet.betAmount,
    });
    return acc;
  }, new Map<string, Map<string, { user: string; bet: number }[]>>());
}

export async function updateBetPoints(
  users: { first: string; second: string; third: string },
  guild: string,
  symbol: string
) {
  await db
    .update(bets)
    .set({
      points: 5,
    })
    .where(
      and(
        eq(bets.guild, guild),
        eq(bets.userId, users.first),
        eq(bets.symbol, symbol),
        lte(bets.date, day().add(-1, "day").startOf("day").toDate())
      )
    );
  await db
    .update(bets)
    .set({
      points: 3,
    })
    .where(
      and(
        eq(bets.guild, guild),
        eq(bets.userId, users.second),
        eq(bets.symbol, symbol),
        lte(bets.date, day().add(-1, "day").startOf("day").toDate())
      )
    );
  await db
    .update(bets)
    .set({
      points: 1,
    })
    .where(
      and(
        eq(bets.guild, guild),
        eq(bets.userId, users.third),
        eq(bets.symbol, symbol),
        lte(bets.date, day().add(-1, "day").startOf("day").toDate())
      )
    );
}

export async function getLeaderBoard(guild: string, crypto?: string) {
  return db
    .select({ user: bets.userId, points: sum(bets.points) })
    .from(bets)
    .where(eq(bets.guild, guild))
    .groupBy(bets.guild, bets.userId);
}
