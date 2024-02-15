import { Attributes, RunParams } from "../../src/Types";
import { ytmp3, ytmp4 } from "../../src/Scraper";

interface BotRequest {
  [key: string]: any;
}

export default {
  alias: ["yt"],
  desc: "youtube video/audio download",
  category: "downloader",
  async run({ m, bot }: RunParams, { query, userId, chatId, args, messageId, isUrl }: Attributes): Promise<void> {
    bot.onRequest = bot.onRequest || {};

    const onRequest = bot.onRequest;

    const cancelRequest = (): void => {
      m.editMessageReplyMarkup({}, {
        chat_id: chatId,
        message_id: m.update.callback_query.message.message_id
      });
      if (onRequest[userId]) {
        delete onRequest[userId];
        m.reply('Permintaan download youtube dibatalkan.');
      }
    };

    const handleAudio = async (): Promise<void> => {
      cancelRequest();
      m.reply('Audio telah dipilih. Mohon tunggu, audio sedang dikirim...');
      const res = await ytmp3(args[2]);
      const { url } = res;
      m.replyWithAudio(
        { url: url },
        { reply_to_message_id: messageId }
      );
    };

    const handleVideo = async (): Promise<void> => {
      cancelRequest();
      m.reply('Video telah dipilih. Mohon tunggu, video sedang dikirim...');
      const res = await ytmp4(args[2]);
      const { url } = res;
      m.replyWithVideo(
        { url: url },
        { reply_to_message_id: messageId }
      );
    };

    if (query) {
      switch (args[1]) {
        case 'cancel':
          cancelRequest();
          break;
        case 'audio':
          handleAudio();
          break;
        case 'video':
          handleVideo();
          break;
        default:
          if (onRequest[userId]) {
            delete onRequest[userId];
          }
          if (isUrl(args[1])) {
            const button: any[][] = [
              [
                {
                  text: "Audio",
                  callback_data: `/youtube audio ${args[1]}`
                },
                {
                  text: "Video",
                  callback_data: `/youtube video ${args[1]}`
                }
              ]
            ];
            m.reply('Apa yang ingin anda download?', {
              reply_markup: {
                inline_keyboard: button,
              }
            });
          } else {
            m.reply('Tolong berikan url dengan benar!');
            onRequest[userId] = {
              command: "youtube"
            };
          }
      }
    } else {
      onRequest[userId] = {
        command: "youtube"
      };
      m.reply('Kirim linknya kak');
    }
  }
};