import { timestamp } from "drizzle-orm/mysql-core";
import { float } from "drizzle-orm/mysql-core";
import { int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const configs = mysqlTable("configurations", {
  id: varchar("guild", { length: 20 }).primaryKey(),
  updateTime: int("updateTime").notNull().default(10),
  adminRole: varchar("adminRole", { length: 20 }),
});

export const channels = mysqlTable(
  "channels",
  {
    guild: varchar("guild", { length: 20 }),
    channel: varchar("channel", { length: 20 }),
    symbol: varchar("symbol", { length: 10 }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.guild, table.channel] }),
    };
  }
);

export const symbols = mysqlTable("symbols", {
  symbol: varchar("symbol", { length: 10 }).primaryKey(),
  value: varchar("value", { length: 30 }).notNull(),
});

export const bets = mysqlTable("bets", {
  id: int("id").primaryKey().autoincrement(),
  guild: varchar("guild", { length: 20 }).notNull(),
  userId: varchar("userId", { length: 20 }).notNull(),
  betAmount: float("bet_amount").notNull(),
  date: timestamp("date").defaultNow(),
  symbol: varchar("symbol", { length: 10 }).notNull(),
  points: int("points").notNull().default(0),
});
