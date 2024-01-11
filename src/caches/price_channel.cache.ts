import { NonThreadGuildBasedChannel } from "discord.js";

type ChannelConfig = {
  channelId: string;
  symbol: string;
};

export const channels = new Map<string, ChannelConfig[]>();

export function setNewChannel(
  channel: NonThreadGuildBasedChannel,
  symbol: string
) {
  if (!channels.has(channel.guildId)) {
    channels.set(channel.guildId, []);
  }

  channels.get(channel.guildId)?.push({
    channelId: channel.id,
    symbol,
  });
}
