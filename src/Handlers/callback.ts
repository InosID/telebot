export default async function handler(message: any, connection: any, commandMap: any): Promise<void> {
  const data = message.callbackQuery.data;
  const isCommand: boolean = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(data);
  const prefix: string = isCommand ? data[0] : "";
  const cleanData: string = data.replace(prefix, "");
  const query: string = cleanData.trim().split(/ +/).slice(1).join(" ");

  const commandName: string = data
    .replace(prefix, "")
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase();

  const cmd =
    commandMap.telegram.get(data.trim().split(/ +/).shift().toLowerCase()) ||
    [...commandMap.telegram.values()].find((cmd: any) =>
      cmd.alias.find(
        (alias: string) => alias.toLowerCase() == data.trim().split(/ +/).shift().toLowerCase()
      )
    ) ||
    commandMap.telegram.get(commandName) ||
    [...commandMap.telegram.values()].find((cmd: any) =>
      cmd.alias.find((alias: string) => alias.toLowerCase() == commandName)
    );

  if (!cmd) return;
  // let options: any = cmd.options;
  try {
    await cmd.run(
      { message, connection },
      {
        query,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
