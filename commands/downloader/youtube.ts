import { Attributes, RunParams } from "../../src/Types"
import { ytmp3, ytmp4 } from "../../src/Scraper"

export default {
  alias: ["yt"],
  desc: "youtube video/audio download",
  category: "downloader",
  async run(
    { m, bot }: RunParams,
    { query, userId, chatId, args, messageId, isUrl }: Attributes
  ) {
    bot.onRequest = bot.onRequest ? bot.onRequest : {}
    if (query) {
      switch (args[1]) {
        case 'cancel':
          m.editMessageReplyMarkup({}, {
            chat_id: chatId,
            message_id: m.update.callback_query.message.message_id
          })
          if (bot.onRequest[userId]) {
            delete bot.onRequest[userId]
            m.reply('Permintaan download youtube dibatalkan.')
          }
          break
        case 'audio':
          if (bot.onRequest[userId]) {
            delete bot.onRequest[userId];
          }
          m.editMessageReplyMarkup({}, {
            chat_id: chatId,
            message_id: m.update.callback_query.message.message_id
          })
          m.reply('Audio telah dipilih. Mohon tunggu, audio sedang dikirim...')
          var res = await ytmp3(args[2])
          var { url } = res
          m.replyWithAudio(
            { url: url },
            { reply_to_message_id: messageId }
          )
          break
        case 'video':
          if (bot.onRequest[userId]) {
            delete bot.onRequest[userId];
          }
          m.editMessageReplyMarkup({}, {
            chat_id: chatId,
            message_id: m.update.callback_query.message.message_id
          })
          m.reply('Video telah dipilih. Mohon tunggu, video sedang dikirim...')
          var res = await ytmp4(args[2])
          var { url } = res
          m.replyWithVideo(
            { url: url },
            { reply_to_message_id: messageId }
          )
          break
        default:
          if (bot.onRequest[userId]) {
            delete bot.onRequest[userId];
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
            ]
            m.reply('Apa yang ingin anda download?', {
              reply_markup: {
                inline_keyboard: button,
              }
            })
          } else {
            m.reply('Tolong berikan url dengan benar!')
            bot.onRequest[userId] = {
              command: "youtube"
            }
          }
      }
    } else {
      bot.onRequest[userId] = {
        command: "youtube"
      }
      m.reply('Kirim linknya kak')
    }
  }
}