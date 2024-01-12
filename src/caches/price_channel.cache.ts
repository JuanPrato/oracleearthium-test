import { NonThreadGuildBasedChannel } from "discord.js";

export type ChannelConfig = {
  channelId: string;
  symbol: string;
};

export const priceChannels = new Map<string, ChannelConfig[]>();

export function setNewChannel(
  channel: NonThreadGuildBasedChannel,
  symbol: string
) {
  if (!priceChannels.has(channel.guildId)) {
    priceChannels.set(channel.guildId, []);
  }

  priceChannels.get(channel.guildId)?.push({
    channelId: channel.id,
    symbol,
  });
}
