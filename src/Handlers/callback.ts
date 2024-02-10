import '../../settings';

export default async function callback(m: any, bot: any, attr: any): Promise<void> {
  const message: string = m.callbackQuery.data;
  const isMultiPrefix: boolean = !!process.env.MULTI_PREFIX?.match(/(true|y(es)?|ya)/i);
  let isCommand: boolean;

  if (isMultiPrefix) {
    isCommand = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(message);
  } else {
    const prefix: string = process.env.PREFIX || '';
    isCommand = message.startsWith(prefix);
  }

  const prefixLength: number = isCommand ? 1 : 0;
  const commandWithoutPrefix: string = message.slice(prefixLength).trim();
  const [cmdName, ...args]: string[] = commandWithoutPrefix.split(/\s+/).map(arg => arg.toLowerCase());
  
  const command = 
    attr.command.get(cmdName) ||
    [...attr.command.values()].find(cmd => cmd.alias.includes(cmdName));

  if (!command) return;

  const options = command.options;
  
  try {
    await command.run(
      { m, bot },
      { query: args.join(' ') } // Changed to join args with space
    );
  } catch (e) {
    console.error(e);
  }
}
