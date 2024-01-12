import { AuditLogEvent, Events } from "discord.js";
import { client } from "../app";
import { getPriceForSymbols } from "../lib/binance.api";
import { prices } from "../caches/price.cache";
import { priceChannels, setNewChannel } from "../caches/price_channel.cache";

client.on(Events.ChannelCreate, async (channel) => {
  if (!channel.guild || !channel.isVoiceBased()) return;

  const guild = channel.guild;
  const logs = await guild.fetchAuditLogs({
    type: AuditLogEvent.ChannelCreate,
    limit: 1,
  });
  const creator = logs.entries.first()?.executor;

  if (!creator) return;

  if (guild.ownerId !== creator.id) return;

  const [crypto, ..._] = channel.name.split(":");

  try {
    const [{ price }, ..._] = await getPriceForSymbols([crypto]);

    if (!price) return;

    channel.setName(`${crypto}: ${Number(price).toFixed(2)} U$D`);

    prices.set(crypto, price);

    setNewChannel(channel, crypto);
  } catch (e) {
    console.error(e);
  }
});
