import { and, eq } from "drizzle-orm";
import { db } from "..";
import { channels } from "../db/schema";

export async function removeGuild(guild: string) {
  return db.delete(channels).where(eq(channels.guild, guild));
}

export async function removeChannel(guildId: string, channelId: string) {
  return db
    .delete(channels)
    .where(and(eq(channels.guild, guildId), eq(channels.channel, channelId)));
}
