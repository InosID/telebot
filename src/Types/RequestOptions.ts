import { Bot } from ".";

interface RequestOptions {
  m: any;
  bot: Bot;
  userId: number;
  isUrl: (url: string) => RegExpMatchArray | null;
  args: string[];
  messageId: number;
}