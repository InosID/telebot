import '../../settings';

interface Message {
  callbackQuery: {
    data: string;
  };
}

interface Bot {
  [key: string]: any; // Define bot object properties as needed
}

interface Command {
  run: (context: { m: Message; bot: Bot }, attributes: { query: string }) => Promise<void>;
  alias: string[];
}

export default async function Callback(m: { callbackQuery: { data: string } }, bot: Bot, commandMap: Map<string, Command>): Promise<void> {
  const data: string = m.callbackQuery.data;
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/true|ya|y(es)?/);
  const prefix: string = isMultiPrefix ? data[0] : process.env.PREFIX || '';
  const cleanData: string = data.replace(prefix, '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');
  const commandName: string | undefined = cleanData.trim().split(/ +/).shift()?.toLowerCase();

  const cmd: Command | undefined =
    commandMap.get(commandName || '') ||
    [...commandMap.values()].find((cmd: Command) =>
      cmd.alias.find((alias: string) => alias.toLowerCase() === commandName)
    ) ||
    commandMap.get(data.trim().split(/ +/).shift()?.toLowerCase() || '') ||
    [...commandMap.values()].find((cmd: Command) =>
      cmd.alias.find((alias: string) => alias.toLowerCase() === data.trim().split(/ +/).shift()?.toLowerCase() || '')
    );

  if (!cmd) return;

  try {
    await cmd.run(
      { m, bot },
      { query }
    );
  } catch (error) {
    console.error(error);
  }
}
