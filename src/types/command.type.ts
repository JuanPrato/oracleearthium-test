import {
  TextChannel,
  GuildMember,
  MessageReplyOptions,
  Message,
  CommandInteractionOption,
} from "discord.js";

export type Run<T = string[]> = (
  message: IAnswerable,
  args: T
) => Promise<void>;
export type ArgsParser<T = string[]> = (raw: string[]) => T;

export type ICommand<T = string[]> = {
  argsParser?: ArgsParser<T>;
  command: string;
  run: Run<T>;
  slashCommand: any;
  slashArgsParser: (args: readonly CommandInteractionOption[]) => T;
};

export interface ICommandException {
  error: Error;
  message: string;
}

export interface IAnswerable {
  reply: (options: string | MessageReplyOptions) => Promise<Message<true>>;
  channel: TextChannel;
  member: GuildMember;
}

export function isAnswerable(ans: any): ans is IAnswerable {
  return (
    ans["reply"] !== undefined &&
    ans["channel"]["send"] !== undefined &&
    ans["member"] !== undefined
  );
}
