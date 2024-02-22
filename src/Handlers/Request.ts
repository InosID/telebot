import fs from 'fs';
import path from 'path';
import { translate } from '../Helpers';
import { RequestRecord } from 'src/Interfaces';

function handleError(command: string): void {
  console.error(`Error: Command "${command}" not found in Request handlers`);
}

export function handleRequest(
  m: any,
  bot: any,
  userId: number,
  isUrl: (url: string) => RegExpMatchArray | null,
  args: string[],
  messageId: number | undefined,
  query: string
): void {
  bot.onRequest = bot.onRequest || {};

  const requestRecord: RequestRecord | undefined = bot.onRequest[userId];

  if (!requestRecord) return;

  const { command } = requestRecord;
  const requestsDirectory: string = path.join(__dirname, 'Request');

  try {
    const files: string[] = fs.readdirSync(requestsDirectory);
    const requestCommands: string[] = files.map(file => path.parse(file).name);

    if (!requestCommands.includes(command)) {
      handleError(command);
      return;
    }

    const handler = require(`./Request/${command}`).handler;

    async function l(text: string): Promise<string> {
      return translate(text, m.message.from.language_code);
    };
    handler({
      m,
      bot,
    }, {
      isUrl,
      args,
      messageId,
      query,
      userId,
      l
    });
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}
