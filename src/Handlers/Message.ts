import { findCommand } from '../Utils';
import '../../settings';

interface Message {
  text?: string;
  caption?: string;
  photo?: any;
  video?: any;
  audio?: any;
  sticker?: any;
  contact?: any;
  location?: any;
  document?: any;
  animation?: any;
}

interface Bot {
  [key: string]: any; // Define bot object properties as needed
}

interface Attributes {
  [key: string]: any; // Define attributes object properties as needed
}

interface Command {
  run: (context: { m: any; bot: Bot }, attributes: Attributes) => Promise<void>;
}

const commands = global.attr;

export default async function handleMessage(m: { message: Message }, bot: Bot, attr: Attributes): Promise<void> {
  const message: string = (m.message?.text || m.message?.caption || '') as string;
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/true|ya|y(es)?/);
  const prefix: string = isMultiPrefix ? (message.match(/^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/gi) ?? ['-'])[0] : process.env.PREFIX ?? '-';

  const cleanData: string = message.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');

  const messageTypes: string[] = ['photo', 'video', 'audio', 'sticker', 'contact', 'location', 'document', 'animation'];
  let typeMessage: string = message.substr(0, 50).replace(/\n/g, '');

  for (const messageType of messageTypes) {
    if (m.message.hasOwnProperty(messageType)) {
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

  if (!cmd) return;

  try {
    await cmd.run(
      { m, bot },
      { query, attr }
    );
  } catch (error) {
    console.error(error);
  }
}
