import { gptweb } from 'gpti';
import { Attributes, RunParams } from "../../Interfaces";

export function handleGPTRequest({ m, bot }: RunParams, { args, userId, messageId }: Attributes): void {
  const question = args.join(' ');

  if (!m.callback_query || !m.callback_query.data || !bot.onRequest[userId]) {
    return;
  }

  delete bot.onRequest[userId];

  gptweb({ prompt: question, markdown: false }, (err: Error | null, data?) => {
    if (err) {
      console.error('Error occurred while processing GPT request:', err);
      bot.telegram.sendMessage(m.chat.id, "Error occurred while processing GPT request", {
        reply_to_message_id: messageId
      });
      return;
    }

    if (data) {
      const formattedText = formatText(data.gpt);
      bot.telegram.sendMessage(m.chat.id, formattedText, {
        reply_to_message_id: messageId,
        parse_mode: "MarkdownV2"
      });
    }
  });
}

function formatText(text: string): string {
  return text
    .replace(/\[(.*?)\]\((.*?)\)/g, "[$1]($2)")
    .replace(/([^\w\s\n`])/g, "\\$1")
    .replace(/\\\*/gi, "*");
}
