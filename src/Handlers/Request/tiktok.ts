import { Attributes, RunParams } from "../../Interfaces";
import { tiktod } from "../../Scraper";
import { InlineKeyboardMarkup } from "typegram";

export async function handleTikTokRequest({ bot, m }: RunParams, { args, isUrl, userId, l }: Attributes): Promise<void> {
  if (!args || !args[0] || !isUrl(args[0])) {
    const invalidUrlButton: { text: string; callback_data: string }[][] = [[{ text: await l("Batal"), callback_data: "/tiktok cancel" }]];
    const invalidUrlMessage: string = await l("Kamu tidak mengirimkan link TikTok dengan benar.");
    const sended = await m.reply(invalidUrlMessage, { reply_markup: { inline_keyboard: invalidUrlButton } });
    updateOnRequest(userId, sended, bot);
    return;
  }

  if (!args[0].includes('tiktok.com')) {
    const invalidUrlButton: { text: string; callback_data: string }[][] = [[{ text: await l("Batal"), callback_data: "/tiktok cancel" }]];
    const invalidUrlMessage: string = await l("Kamu tidak mengirimkan link TikTok dengan benar.");
    const sended = await m.reply(invalidUrlMessage, { reply_markup: { inline_keyboard: invalidUrlButton } });
    updateOnRequest(userId, sended, bot);
    return;
  }

  try {
    const { result } = await tiktod(args[0]);
    const text: string = await l("Apa yang ingin anda download? Tekan batal untuk membatalkan");
    const buttonLabel: string = result.is_image ? "Gambar" : "Video";

    const button: InlineKeyboardMarkup = {
      inline_keyboard: [
        [{ text: await l(buttonLabel), callback_data: `/tiktok ${buttonLabel.toLowerCase()} ${args[0]}` },
        { text: await l("Audio"), callback_data: `/tiktok audio ${args[0]}` }],
        [{ text: await l("Batal"), callback_data: `/tiktok cancel` }]
      ]
    };

    m.reply(await l(text), {
      reply_markup: button
    });

    updateOnRequest(userId, m, bot, true);
  } catch (error) {
    console.error('Error occurred while processing TikTok request:', error);
    const errorMessage: string = await l("Terjadi kesalahan saat memproses permintaan TikTok.");
    const sended = await m.reply(errorMessage);
    updateOnRequest(userId, sended, bot);
  }
}

function updateOnRequest(userId: string, message: any, bot: any, isText: boolean = true): void {
  bot.onRequest[userId] = {
    command: 'tiktok',
    messageId: [message.message_id, ...(bot.onRequest[userId]?.messageId || [])],
    chatId: [message.chat.id, ...(bot.onRequest[userId]?.chatId || [])],
    lastText: [isText ? message.text : false, ...(bot.onRequest[userId]?.lastText || [])]
  };
}
