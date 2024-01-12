import { client } from "../app";
import { prices } from "../caches/price.cache";
import { ChannelConfig, priceChannels } from "../caches/price_channel.cache";
import { getPriceForSymbols } from "../lib/binance.api";
import { removeChannel, removeGuild } from "./db.utils";

export const startRefreshValueTimer = async () => {
  await setNewPriceValues();
  await updateChannelsValues();
  setTimeout(async () => {
    await setNewPriceValues();
    await updateChannelsValues();
  }, 10 * 60 * 1000);
};

async function setNewPriceValues() {
  const trackedSymbols = Array.from(prices.keys());
  if (trackedSymbols.length === 0) return;
  const newPrices = await getPriceForSymbols(trackedSymbols);

  for (const newPrice of newPrices) {
    prices.set(newPrice.symbol, newPrice.price);
  }
}

export const updateChannelsValues = async () => {
  await client.guilds.fetch();

  for (const [guildId, channels] of Array.from(priceChannels.entries())) {
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      priceChannels.delete(guildId);
      await removeGuild(guildId);
      continue;
    }

    await guild.channels.fetch();

    const toDelete: string[] = [];

    for (const channelConfig of channels) {
      const channel = guild.channels.cache.get(channelConfig.channelId);

      if (!channel) {
        toDelete.push(channelConfig.channelId);
        continue;
      }
      const price = prices.get(channelConfig.symbol);

      channel.setName(`${crypto}: ${Number(price).toFixed(2)} U$D`);
    }

    for (const channel of toDelete) {
      await removeChannel(guildId, channel);
    }

    priceChannels.set(
      guildId,
      channels.filter((c) => !toDelete.includes(c.channelId))
    );
  }
};
