import { int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const configs = mysqlTable("configurations", {
  id: varchar("guild", { length: 20 }).primaryKey(),
  updateTime: int("updateTime").notNull().default(10),
  adminRole: varchar("adminRole", { length: 20 }),
});

export const points = mysqlTable(
  "points",
  {
    guild: varchar("guild", { length: 20 }).primaryKey(),
    user: varchar("user", { length: 20 }).primaryKey(),
    points: int("points").notNull().default(0),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.guild, table.user] }),
    };
  }
);
