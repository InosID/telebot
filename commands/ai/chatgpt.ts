import { gptweb } from 'gpti';
import { RunParams, Attributes } from '../../src/Interfaces';

export default {
  name: "chatgpt",
  alias: ["chatgpt4", "gpt", "gpt4"],
  category: "ai",
  desc: "Artificial intelligence with chatgpt 4",
  async run({ m, bot }: RunParams, { query, messageId, userId, args }: Attributes): Promise<void> {
    bot.onRequest = bot.onRequest || {};
    const onRequest = bot.onRequest;

    if (onRequest[userId]) delete onRequest[userId];

    if (query) {
      gptweb({ prompt: args.join(' '), markdown: false }, (err: Error | null, data?) => {
        if (err) {
          console.error(err);
          m.reply("Terjadi kesalahan saat memproses permintaan.", { reply_to_message_id: messageId });
        } else {
          const str = data?.gpt?.replace(/[_*[\]()~>#\+\-=|{}.!]/g, "\\$&");
          if (str) {
            m.replyWithMarkdownV2(str, { reply_to_message_id: messageId });
          } else {
            m.reply("Maaf, tidak ada respons yang diberikan.", { reply_to_message_id: messageId });
          }
        }
      });
    } else {
      onRequest[userId] = { command: "chatgpt" };
      m.reply('Apa yang ingin kamu tanyakan kak?');
    }
  }
};
