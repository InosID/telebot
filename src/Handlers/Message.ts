import { Command } from '../Interfaces';
import { Context, Telegraf } from 'telegraf';
import { findCommand } from '../Utils';
import { Update } from 'telegraf/typings/core/types/typegram';
import { translate } from '../Helpers';
import { handleRequest } from './Request';

const commands: Record<string, Command> = global.attr as Record<string, Command>;

export async function Message(
  m: any, 
  bot: Telegraf<Context<Update>>, 
  LOGGER: any
): Promise<void> {
  const message = m.message;
  const { text: rawText, caption } = message;
  const text: string = rawText || caption || '';
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/true|ya|y(es)?/);
  const prefix: string = isMultiPrefix ? (text.match(/^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\©^]/gi) ?? ['-'])[0] : process.env.PREFIX ?? '-';
  const user = getUser(message.from);
  const args: string[] = text.trim().split(/ +/);
  const messageId: number | undefined = message.message_id;
  const cleanData: string = text.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');
  const isPrivate: boolean = message.chat.type === 'private';
  const chatId: number | undefined = message.chat.id;
  const userId: number = message.from.id;
  const username: string = message.from.username ?? message.from.first_name ?? "";
  const groupname: string = !isPrivate ? (message.chat.title ?? "") : "";
  const owners: string[] = ["awacherry"];
  const isOwner: boolean = owners.includes(user.username);

  const messageTypes: string[] = ['photo', 'video', 'audio', 'sticker', 'contact', 'location', 'document', 'animation'];

  const type: string = messageTypes
    .filter(messageType => message.hasOwnProperty(messageType))
    .join(', ');

  const [command, ...restArgs] = cleanData.trim().split(" ");
  const lowerCaseCommand = command?.toLowerCase();
  const cmd: Command | false = findCommand(commands, "alias", lowerCaseCommand) || findCommand(commands, "name", lowerCaseCommand);

  async function l(text: string): Promise<string> {
    return translate(text, m.message.from.language_code);
  };

  if (!cmd) {
    handleRequest(m, bot, userId, isUrl, args, messageId, query);
    return;
  }
  
  if (cmd.isPrivate && !isPrivate) {
    await m.reply(chatId, await l('Fitur ini hanya dapat digunakan dalam private chat'));
    return;
  }

  if (cmd.isOwner && !isOwner) return;

  try {
    await cmd.run(
      {
        m,
        bot
      },
      {
        text,
        query,
        commands,
        user,
        userId,
        isUrl,
        args,
        messageId,
        type,
        message,
        l
      }
    );
    const received = LOGGER.command.receive;
    const logMessage = isPrivate ? received.private : received.group;
    console.log(logMessage.replace('%gcname', groupname).replace('%username', username).replace('%cmd', args.join(' ')));
  } catch (error) {
    console.error(error);
  }
}

function getUser(user: any) {
  try {
    const { first_name, last_name } = user;
    const fullName = `${first_name} ${last_name || ''}`.trim();
    return { ...user, full_name: fullName };
  } catch (error) {
    throw error;
  }
}

function isUrl(url: string): RegExpMatchArray | null {
  const urlPattern = new RegExp(/https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi");
  return url.match(urlPattern);
}
