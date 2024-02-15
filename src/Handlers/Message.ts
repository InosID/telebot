import { Bot, Command, Message, User } from '../Types';
import { findCommand } from '../Utils';
import '../../settings';

const commands: Record<string, Command> = global.attr as Record<string, Command>;

export async function Message(m: any, bot: Bot): Promise<void> {
  const message: Message = m.message;
  const text: string = (message.text || message.caption || '') as string;
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/true|ya|y(es)?/);
  const prefix: string = isMultiPrefix ? (text.match(/^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/gi) ?? ['-'])[0] : process.env.PREFIX ?? '-';
  const user: User = getUser(m.from);
  const args: string[] = text.trim().split(/ +/);
  const messageId = m.message.message_id;
  const cleanData: string = text.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');
  const isPrivate = m.chat.type == 'private';
  const userId = m.message.from.id;

  const messageTypes: string[] = ['photo', 'video', 'audio', 'sticker', 'contact', 'location', 'document', 'animation'];
  let typeMessage: string = text.substr(0, 50).replace(/\n/g, '');

  for (const messageType of messageTypes) {
    if (message.hasOwnProperty(messageType)) {
      typeMessage = messageType.charAt(0).toUpperCase() + messageType.slice(1);
      break;
    }
  }

  let command: string = '';
  const trimmedData: string = cleanData.trim();
  const splitData: string[] = trimmedData.split(" ");

  if (splitData.length > 0) {
    command = splitData.shift()?.toLowerCase() ?? '';
  }

  const cmd: Command | false = findCommand(commands, "alias", command);

  if (!cmd) {
    require('./Request').handleRequest(m, bot, userId, isUrl, args, messageId)
  }
  
  if (!cmd) return;
  if (!isPrivate && cmd?.isPrivate) {
    return bot.reply(message.chat.id, 'Fitur ini hanya dapat digunakan dalam private chat');
  }

  try {
    await cmd.run(
      {
        m,
        bot
      },
      {
        query,
        commands,
        user,
        userId,
        isUrl,
        args,
        messageId
      }
    );
  } catch (error) {
    console.error(error);
  }
}

function getUser(user: User): User {
  try {
    const lastName = user["last_name"] || "";
    const fullName = user.first_name + " " + lastName;
    user["full_name"] = fullName.trim();
    return user;
  } catch (error) {
    throw error;
  }
}

function isUrl(url: string): RegExpMatchArray | null {
  const urlPattern = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi");
  return url.match(urlPattern);
}