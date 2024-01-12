import { client } from "../app";
import { prices } from "../caches/price.cache";
import { ChannelConfig, priceChannels } from "../caches/price_channel.cache";
import { getPriceForSymbols } from "../lib/binance.api";
import {
  checkAndDeleteUnusedSymbol,
  removeChannel,
  removeGuild,
} from "./db.utils";

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

    const toDelete: ChannelConfig[] = [];

    for (const channelConfig of channels) {
      const channel = guild.channels.cache.get(channelConfig.channelId);

      if (!channel) {
        toDelete.push(channelConfig);
        continue;
      }
      const price = prices.get(channelConfig.symbol);

      channel.setName(
        `${channelConfig.symbol}: ${Number(price).toFixed(2)} U$D`
      );
    }

    for (const { channelId } of toDelete) {
      await removeChannel(guildId, channelId);
    }
    for (const { symbol } of toDelete) {
      await checkAndDeleteUnusedSymbol(symbol);
    }

    priceChannels.set(
      guildId,
      channels.filter(
        (c) => !toDelete.some((td) => td.channelId === c.channelId)
      )
    );
  }
};
