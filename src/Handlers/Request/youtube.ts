import { Input } from "telegraf";
import { allThumbnail } from "../../Scraper";
import { Attributes, RunParams } from "../../Interfaces";

type Thumbnail = Record<string, string>;

export async function handler({ m, bot }: RunParams, { isUrl, args, userId, l }: Attributes): Promise<void> {
  if (!args || args.length === 0 || !isUrl(args[0])) {
    const invalidUrlButton: { text: string; callback_data: string }[][] = [[{ text: await l("Batal"), callback_data: "/youtube cancel" }]];
    if (m.update.message.chat.type === 'private') {
      const invalidUrlMessage: string = await l("Kamu tidak mengirimkan link youtube dengan benar.");
      const sended = await m.reply(invalidUrlMessage, { reply_markup: { inline_keyboard: invalidUrlButton } });
      updateOnRequest(userId, sended, bot);
    }
    return;
  }

  const urlPattern: RegExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\?si=([\w-]+))?/;
  const url: string = args[0];
  const match: RegExpMatchArray | null = url.match(urlPattern);
  const videoId: string | null = match?.[1] ?? null;

  if (!videoId) {
    const invalidUrlButton: { text: string; callback_data: string }[][] = [[{ text: await l("Batal"), callback_data: "/youtube cancel" }]];
    const invalidUrlMessage: string = await l("Kamu tidak mengirimkan link youtube dengan benar.");
    const sended = await m.reply(invalidUrlMessage, { reply_markup: { inline_keyboard: invalidUrlButton } });
    updateOnRequest(userId, sended, bot);
    return;
  }

  allThumbnail(videoId, "", async (thumbnails: Thumbnail) => {
    const { maxres, standard, high, medium, default: def } = thumbnails;
    const thumb: string | undefined = maxres || standard || high || medium || def;

    const button = [
      [
        { text: await l("Audio"), callback_data: `/youtube audio ${url}` },
        { text: await l("Video"), callback_data: `/youtube video ${url}` },
      ],
      [{ text: await l("Batal"), callback_data: `/youtube cancel` }]
    ];

    if (thumb) {
      const caption: string = await l("Apa yang ingin anda download? Tekan batal untuk membatalkan");
      const sended = await m.replyWithPhoto(Input.fromURL(thumb), { caption, reply_markup: { inline_keyboard: button } });
      updateOnRequest(userId, sended.message_id, bot, false);
    } else {
      const errorMessage: string = await l("Tidak ada thumbnail yang ditemukan untuk video ini.");
      const sended = await m.reply(errorMessage, { reply_markup: { inline_keyboard: button } });
      updateOnRequest(userId, sended.message_id, bot, true);
    }
  });
}

function updateOnRequest(userId: string, messageId: number, bot: any, isText: boolean = true): void {
  bot.onRequest[userId] = {
    command: 'youtube',
    messageId: [messageId, ...(bot.onRequest[userId]?.messageId || [])],
    chatId: [bot.onRequest[userId]?.chatId || []],
    lastText: [isText ? messageId : false, ...(bot.onRequest[userId]?.lastText || [])]
  };
}
