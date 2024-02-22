import { InlineKeyboardMarkup } from 'typegram';
import { Attributes, RunParams } from '../../src/Interfaces';
import { ytmp3, ytmp4 } from '../../src/Scraper';

export default {
  name: 'youtube',
  alias: ['yt'],
  desc: 'youtube video/audio download',
  category: 'downloader',
  async run({ m, bot }: RunParams, { query, userId, args, l }: Attributes): Promise<void> {
    bot.onRequest = bot.onRequest || {};

    const onRequest = bot.onRequest;
    const isYouTubeLink: boolean = args.join(' ').includes('://youtu');

    const cancelRequest = async (): Promise<void> => {
      if (onRequest[userId]) {
        const { lastText, chatId, messageId } = onRequest[userId];
        for (let i = 0; i < messageId.length; i++) {
          if (lastText[i]) {
            await m.editMessageText(lastText[i], { chat_id: chatId[i], message_id: messageId[i], reply_markup: {} });
          } else {
            await m.deleteMessage(messageId[i]);
          }
        }
        delete onRequest[userId];
      }
    };

    const handleAudio = async (): Promise<void> => {
      if (!isYouTubeLink) return m.reply(await l('Kamu tidak mengirimkan link YouTube dengan benar.'));
      cancelRequest();
      const { url } = await ytmp3(args[2]);
      m.replyWithAudio({ url }, { caption: await l('Selesai') });
    };

    const handleVideo = async (): Promise<void> => {
      if (!isYouTubeLink) return m.reply(await l('Kamu tidak mengirimkan link YouTube dengan benar.'));
      cancelRequest();
      const { url } = await ytmp4(args[2]);
      m.replyWithVideo({ url }, { caption: await l('Selesai') });
    };

    if (query) {
      switch (args[1]) {
        case 'cancel':
          cancelRequest();
          m.reply(await l('Permintaan download YouTube dibatalkan.'));
          break;
        case 'audio':
          handleAudio();
          break;
        case 'video':
          handleVideo();
          break;
        default:
          if (onRequest[userId]) delete onRequest[userId];
          if (isYouTubeLink && args[1]) {
            const button: InlineKeyboardMarkup = {
              inline_keyboard: [
                [{ text: await l('Audio'), callback_data: `/youtube audio ${args[1]}` },
                { text: await l('Video'), callback_data: `/youtube video ${args[1]}` }],
                [{ text: await l('Batal'), callback_data: `/youtube cancel` }]
              ]};
            m.reply(await l('Apa yang ingin anda download?'), { reply_markup: button });
          } else {
            m.reply(await l('Tolong berikan URL dengan benar!'));
            onRequest[userId] = { command: 'youtube', chatId: [], messageId: [], lastText: [] };
          }
      }
    } else {
      onRequest[userId] = { command: 'youtube', chatId: [], messageId: [], lastText: [] };
      m.reply(await l('Kirim linknya kak'));
    }
  }
};
