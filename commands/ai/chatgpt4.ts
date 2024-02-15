import { Attributes, RunParams } from '../../src/Types';
import { gptweb } from 'gpti';

export default {
  alias: ["chatgpt", "gpt", "gpt4"],
  category: "ai",
  desc: "Artificial intelegent with",
  async run({ m, bot }: RunParams, { query, messageId }: Attributes) {
    bot.onRequest = bot.onRequest || {};
    if (query) {
      gptweb({ prompt: query, markdown: true }, (err, data) => {
        if (err) {
          console.log(console.log(err))
          m.reply("Error", {
            reply_to_message_id: messageId
          })
        } else {
          console.log(data)
          m.replyWithMarkdownV2(data.gpt, {
            reply_to_message_id: messageId
          })
        }
      })
    } else {}
  }
}