import { AuditLogEvent, Events } from "discord.js";
import { client } from "../app";
import { getPriceForSymbols } from "../lib/binance.api";
import { prices } from "../caches/price.cache";
import { priceChannels, setNewChannel } from "../caches/price_channel.cache";
import { saveNewChannel } from "../utils/db.utils";
import { configMap } from "../caches/config.cache";

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

  const dsCreator = guild.members.cache.get(creator.id);

  const config = configMap.get(guild.id);
  if (
    !config ||
    !config.adminRoleId ||
    !dsCreator?.roles.cache.some((role) => role.id === config?.adminRoleId)
  ) {
    return;
  }

  const [crypto, ..._] = channel.name.split(":");

  try {
    const [{ price }, ..._] = await getPriceForSymbols([crypto]);

    if (!price) return;

    channel.setName(`${crypto}: ${Number(price).toFixed(2)} U$D`);

    setNewChannel(channel, crypto);
    await saveNewChannel(channel.id, channel.guildId, crypto, price);

    prices.set(crypto, price);
  } catch (e) {
    console.error(e);
  }
});
