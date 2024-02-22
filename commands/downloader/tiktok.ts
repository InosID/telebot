import { InlineKeyboardMarkup } from 'typegram';
import { Input } from 'telegraf';
import { Attributes, RunParams } from "../../src/Interfaces";
import { tiktod } from "../../src/Scraper";

export default {
  name: "tiktok",
  alias: ["tt", "ttm", "tiktokmusic", "ttdl"],
  desc: "Download tiktok video or music",
  category: "downloader",
  async run({ m, bot }: RunParams, { query, args, userId, chatId, messageId, isUrl, l }: Attributes): Promise<void> {
    bot.onRequest = bot.onRequest || {};

    const onRequest = bot.onRequest;
    const isTikTokLink: boolean = args.join(' ').includes('tiktok');

    const cancelRequest = async(): Promise<void> => {
      if (onRequest[userId]) {
        const { lastText, chatId, messageId } = onRequest[userId];
        for (let i = 0; i < onRequest[userId].messageId.length; i++) {
          if (lastText[i]) {
            await m.editMessageText(lastText[i], { chat_id: chatId[i], message_id: messageId[i], reply_markup: {} });
          }
        }
        delete bot.onRequest[userId]
      }
    }

    const handleImage = async(): Promise<void> => {
      if (!isTikTokLink) return m.reply(await l('Kamu tidak mengirimkan link Tiktok dengan benar.'));
      cancelRequest()
      m.editMessageText(
        await l('Gambar sedang dikirim, mohon tunggu sebentar...'),
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {}
        }
      );
      const { result } = await tiktod(args[2])
      if (result.media.length > 1) {
        for (const i of result.media) {
          m.replyWithPhoto(Input.fromURL(i), {
            caption: await l("Selesai")
          })
        }
        m.deleteMessage(messageId)
      } else {
        m.replyWithPhoto(Input.fromURL(result.media[0]), {
          caption: await l("Selesai")
        })
      }
    }

    const handleVideo = async(): Promise<void> => {
      if (!isTikTokLink) return m.reply(await l('Kamu tidak mengirimkan link Tiktok dengan benar.'));
      m.editMessageText(
        await l('Video sedang dikirim, mohon tunggu sebentar...'),
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {}
        }
      );
      const { result } = await tiktod(args[2])
      m.replyWithVideo({ url: result.media }, {
        caption: await l("Selesai")
      })
      m.deleteMessage(messageId)
    }

    const handleAudio = async() => {
      m.editMessageText(
        await l('Audio sedang dikirim, mohon tunggu sebentar...'),
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {}
        }
      );
      const { result } = await tiktod(args[2])
      m.replyWithVideo({ url: result.music.url }, {
        caption: await l("Selesai")
      })
      m.deleteMessage(messageId)
    }

    if (query) {
      switch(args[1]) {
        case 'cancel':
          cancelRequest()
          await m.reply(await l("Permintaan download Tiktok dibatalkan."))
          break;
        case 'video':
          await handleVideo()
          break
        case 'audio':
          await handleAudio()
          break
        case 'image':
          await handleImage()
          break
        default:
          if (onRequest[userId]) delete onRequest[userId]
          if (isUrl(args[1])) {
            let data = await tiktod(args[1]);
            if (data.result.is_image) {
              const button: InlineKeyboardMarkup = {
                inline_keyboard: [
                  [{ text: await l("Gambar"), callback_data: `/tiktok image ${args[1]}` },
                  { text: await l("Audio"), callback_data: `/tiktok audio ${args[1]}` }],
                  [{ text: await l("Batal"), callback_data: `/tiktok cancel` }]
                ]
              }
              m.reply("Apa yang ingin kamu download?", {
                reply_markup: button
              })
            } else {
              const button: InlineKeyboardMarkup = {
                inline_keyboard: [
                  [{ text: await l("Video"), callback_data: `/tiktok video ${args[1]}` },
                  { text: await l("Audio"), callback_data: `/tiktok audio ${args[1]}` }],
                  [{ text: await l("Batal"), callback_data: `/tiktok cancel` }]
                ]
              }
              m.reply("Apa yang ingin kamu download?", {
                reply_markup: button
              })
            }
          } else {
            m.reply(await l('Tolong berikan URL dengan benar!'));
            onRequest[userId] = { command: "tiktok", chatId: [], messageId: [], lastText: [] };
          }
      }
    } else {
      onRequest[userId] = { command: "tiktok", chatId: [], messageId: [], lastText: [] };
      m.reply(await l('Kirim linknya kak'));
    }
  }
}