import '../../settings';

export default async function handleMessage(m: any, bot: any, attr: any): Promise<void> {
  const message: any = m.message.text || m.message.caption || '';
  const isCommand: boolean = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(message);
  const prefix: string = isCommand ? message[0] : process.env.PREFIX || '';
  const cleanData: string = message.replace(prefix, '');
  const query: string = cleanData.trim().split(/ +/).slice(1).join(' ');

  const isImage: boolean = m.message.hasOwnProperty('photo');
  const isVideo: boolean = m.message.hasOwnProperty('video');
  const isAudio: boolean = m.message.hasOwnProperty('audio');
  const isSticker: boolean = m.message.hasOwnProperty('sticker');
  const isContact: boolean = m.message.hasOwnProperty('contact');
  const isLocation: boolean = m.message.hasOwnProperty('location');
  const isDocument: boolean = m.message.hasOwnProperty('document');
  const isAnimation: boolean = m.message.hasOwnProperty('animation');

  let typeMessage: string = message.substr(0, 50).replace(/\n/g, '');
  if (isImage) typeMessage = 'Image';
  else if (isVideo) typeMessage = 'Video';
  else if (isAudio) typeMessage = 'Audio';
  else if (isSticker) typeMessage = 'Sticker';
  else if (isContact) typeMessage = 'Contact';
  else if (isLocation) typeMessage = 'Location';
  else if (isDocument) typeMessage = 'Document';
  else if (isAnimation) typeMessage = 'Animation';

  const commandName: string = message
    .replace(prefix, '')
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase();

  const cmd =
    attr.command.get(message.trim().split(/ +/).shift()?.toLowerCase()) ||
    [...attr.command.values()].find((x: any) =>
      x.alias.find(
        (alias: string) => alias.toLowerCase() == message.trim().split(/ +/).shift()?.toLowerCase()
      )
    ) ||
    attr.command.get(commandName) ||
    [...attr.command.values()].find((x: any) =>
      x.alias.find((alias: string) => alias.toLowerCase() == commandName)
    );

  if (!cmd) return;

  try {
    await cmd.run(
      { m, bot },
      {
        query,
        attr,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
