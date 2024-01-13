import { CommandInteractionOption, CacheType } from "discord.js";
import { IAnswerable, ICommand } from "../types/command.type";
import { createSlashCommand } from "../utils/discord.util";
import { getLeaderBoard, saveBet } from "../utils/db.utils";
import { priceChannels } from "../caches/price_channel.cache";

type Args = {
  crypto?: string;
};

const LeaderBoardCommand: ICommand<Args> = {
  command: "leaderboard",
  async run(message: IAnswerable, args: Args): Promise<void> {
    const res = await getLeaderBoard(message.member.guild.id, args.crypto);
    await message.reply(
      `LeaderBoard ${args.crypto ? args.crypto : ""}
      ${res.reduce((acc, v) => {
        return `${acc}
        @<${v.user}>: ${v.points}`;
      }, ``)}
      `
    );
  },
  slashCommand: createSlashCommand("leaderboard", "Display leaderboard", [
    {
      name: "crypto",
      type: "string",
      required: false,
    },
  ]),
  slashArgsParser(args: readonly CommandInteractionOption<CacheType>[]): Args {
    return {
      crypto: args.find((a) => a.name === "crypto")?.value as
        | string
        | undefined,
    };
  },
};

export default LeaderBoardCommand;
