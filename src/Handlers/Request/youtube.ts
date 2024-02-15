import { Input } from "telegraf";
import { allThumbnail } from "../../Scraper";

export function youtube(m: any, isUrl: any, args: any, messageId: any): void {
  console.log(args);
  
  if (isUrl(m.message.text)) {
    const url: string = m.message.text;
    const match: RegExpMatchArray | null = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\?si=([\w-]+))?/);
    const videoId: string | null = match?.[1] ?? null;
    
    if (args[0].match("://youtu") && videoId) {
      allThumbnail(videoId, '', (thumbnails: { [key: string]: string }) => {
        const { maxres, standard, high, medium, default: def } = thumbnails;
        const thumb: string | false = maxres ? maxres : standard ? standard : high ? high : medium ? medium : def ? def : false;
        
        if (thumb) {
          const button: any[][] = [
            [
              {
                text: "Audio",
                callback_data: `/youtube audio ${url}`
              },
              {
                text: "Video",
                callback_data: `/youtube video ${url}`
              }
            ]
          ];
          
          m.replyWithPhoto(Input.fromURL(thumb), {
            caption: "Apa yang ingin anda download?",
            reply_markup: {
              inline_keyboard: button
            }
          }, {
            reply_to_message_id: messageId
          });
        }
      });
    } else {
      const button: any[][] = [
        [
          {
            text: "Batalkan",
            callback_data: "/youtube cancel"
          }
        ]
      ];
      
      m.reply('Link yang anda berikan tidak valid. Silakan kirim link youtube yang valid.', {
        reply_markup: {
          inline_keyboard: button
        }
      });
    }
  } else {
    const button: any[][] = [
      [
        {
          text: "Batalkan",
          callback_data: "/youtube cancel"
        }
      ]
    ];
    
    m.reply("Anda tidak memberikan URL, silahkan kirim ulang URL anda.", {
      reply_markup: {
        inline_keyboard: button
      }
    });
  }
}
