import { findCommand } from '../Utils';
import { Command } from '../Interfaces';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { translate } from '../Helpers';

const commands: Record<string, Command> = global.attr as Record<string, Command>;

export async function Callback(m: any, bot: Telegraf<Context<Update>>, LOGGER: any): Promise<void> {
  const message = m.update;
  if (!message || !message.callback_query) {
    console.error('Invalid callback message received.');
    return;
  }

  const callbackData: string = message.callback_query.data ?? '';
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/true|ya|y(es)?/);
  const prefix: string = isMultiPrefix ? callbackData[0] : process.env.PREFIX || '';
  const cleanData: string = callbackData.replace(prefix, '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');
  const user = getUser(message.callback_query.from);
  const commandName: string | undefined = cleanData.trim().split(/ +/).shift()?.toLowerCase();
  const userId: number | undefined = message.callback_query.from.id;
  const args: string[] = cleanData.trim().split(/ +/);
  const messageId: number | undefined = message.callback_query.message.message_id;
  const chatId: number | undefined = message.callback_query.message.chat.id;

  let command: string = '';
  const trimmedData: string = cleanData.trim();
  const splitData: string[] = trimmedData.split(' ');

  const messageTypes: string[] = ['photo', 'video', 'audio', 'sticker', 'contact', 'location', 'document', 'animation'];

  const type: string = messageTypes
    .filter(messageType => message.hasOwnProperty(messageType))
    .join(', ');

  if (splitData.length > 0) {
    command = splitData.shift()?.toLowerCase() ?? '';
  }

  const cmd: Command | false = findCommand(commands, 'alias', command) || findCommand(commands, 'name', command);

  async function l(text: string): Promise<string> {
    return translate(text, message.callback_query.message.from.language_code);
  }

  if (!cmd) {
    console.error(`Command "${command}" not found.`);
    return;
  }

  try {
    await cmd.run(
      {
        m,
        bot
      },
      {
        text: callbackData,
        query,
        commands,
        user,
        userId,
        args,
        messageId,
        type,
        message,
        chatId,
        l
      }
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

function getUser(user: any) {
  try {
    const lastName = user['last_name'] || '';
    const fullName = user.first_name + ' ' + lastName;
    user['full_name'] = fullName.trim();
    return user;
  } catch (error) {
    throw error;
  }
}

function isUrl(url: string): RegExpMatchArray | null {
  const urlPattern = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi');
  return url.match(urlPattern);
}
