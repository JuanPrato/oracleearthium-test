import { CommandInteractionOption, CacheType } from "discord.js";
import { IAnswerable, ICommand } from "../types/command.type";
import { createSlashCommand } from "../utils/discord.util";
import { saveBet } from "../utils/db.utils";
import { priceChannels } from "../caches/price_channel.cache";

type Args = {
  bet: number;
  crypto: string;
};

const BetCommand: ICommand<Args> = {
  command: "bet",
  async run(message: IAnswerable, args: Args): Promise<void> {
    const channels = priceChannels.get(message.channel.guildId);

    if (!channels?.some((c) => c.symbol === args.crypto)) {
      throw new Error("Invalid crypto");
    }

    const insert = await saveBet(
      args.bet,
      message.member.id,
      message.channel.guildId,
      args.crypto
    );

    await message.reply(
      `The bet was ${insert ? "saved" : "updated"}. Value: ${args.bet}`
    );
  },
  slashCommand: createSlashCommand("bet", "Let you bet on crypto prices", [
    {
      name: "crypto",
      type: "string",
      required: true,
    },
    {
      name: "bet",
      type: "string",
      required: true,
      description: "A number",
    },
  ]),
  slashArgsParser(args: readonly CommandInteractionOption<CacheType>[]): Args {
    const bet = args.find((a) => a.name === "bet")?.value;
    if (isNaN(Number(bet))) {
      throw new Error("");
    }

    return {
      bet: Number(bet),
      crypto: args.find((a) => a.name === "crypto")!.value as string,
    };
  },
};

export default BetCommand;
