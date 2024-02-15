import { findCommand } from '../Utils';
import { Bot, Command, User } from '../Types';
import '../../settings';

const commands: Record<string, Command> = global.attr as Record<string, Command>;

export async function Callback(m: any, bot: Bot): Promise<void> {
  const message: { callbackQuery: { data: string } } = m;
  const data: string = message.callbackQuery.data;
  console.log(data);
  
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/true|ya|y(es)?/);
  const prefix: string = isMultiPrefix ? data[0] : process.env.PREFIX || '';
  const cleanData: string = data.replace(prefix, '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');
  const user: User = getUser(m.update.callback_query.from);
  const commandName: string | undefined = cleanData.trim().split(/ +/).shift()?.toLowerCase();
  const userId = m.update.callback_query.from.id;
  const args = data.trim().split(/ +/);
  const messageId = m.update.callback_query.message.message_id;

  let command: string = '';
  const trimmedData: string = cleanData.trim();
  const splitData: string[] = trimmedData.split(" ");

  if (splitData.length > 0) {
    command = splitData.shift()?.toLowerCase() ?? '';
  }

  const cmd: Command | false = findCommand(commands, "alias", command);

  if (!cmd) return;

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