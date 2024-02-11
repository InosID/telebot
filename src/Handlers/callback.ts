import '../../settings';

export default async function Callback(m: any, bot: any, commandMap: Map<string, any>): Promise<void> {
  const data: string = m.callbackQuery.data;
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/true|ya|y(es)?/);
  let isCommand: boolean;

  if (isMultiPrefix) {
    isCommand = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(data);
  } else {
    isCommand = !!process.env.PREFIX;
  }

  const prefix: string = isCommand && isMultiPrefix ? data[0] : process.env.PREFIX || '';
  const cleanData: string = data.replace(prefix, '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');

  const commandName: string = data
    .replace(prefix, '')
    .trim()
    .split(/ +/)
    .shift()?.toLowerCase() || '';

  const cmd =
    commandMap.get(data.trim().split(/ +/).shift()?.toLowerCase() || '') ||
    [...commandMap.values()].find((cmd: any) =>
      cmd.alias.find((alias: string) => alias.toLowerCase() == data.trim().split(/ +/).shift()?.toLowerCase() || '')
    ) ||
    commandMap.get(commandName) ||
    [...commandMap.values()].find((cmd: any) =>
      cmd.alias.find((alias: string) => alias.toLowerCase() == commandName)
    );

  if (!cmd) return;

  try {
    await cmd.run(
      { m, bot },
      {
        query,
      }
    );
  } catch (error) {
    console.log(error);
  }
}