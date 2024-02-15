import { Input } from "telegraf";
import { allThumbnail } from "../../Scraper";

type Thumbnail = Record<string, string>;

export function youtube(
  m: any,
  isUrl: (text: string) => boolean,
  args: string[]
): void {
  const invalidUrlButton = [
    [{ text: "Batalkan", callback_data: "/youtube cancel" }],
  ];

  // Define URL pattern for YouTube videos
  const urlPattern = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\?si=([\w-]+))?/;

  const sendReply = (
    text: string,
    replyMarkup: any,
    media?: string
  ) => {
    const options: any = { reply_markup: { inline_keyboard: replyMarkup } };
    if (media) {
      options.caption = text
      m.replyWithPhoto(Input.fromURL(media), options);
    } else {
      m.reply(text, options)
    }
  };

  // Check if m.text is a valid URL before further processing
  if (!args[0] || !isUrl(args[0])) {
    return sendReply(
      "Anda tidak memberikan URL yang valid, silakan kirim ulang URL YouTube.",
      invalidUrlButton
    );
  }

  const url: string = args[0];
  const match = url.match(urlPattern); // Menggunakan urlPattern yang telah didefinisikan sebelumnya
  const videoId: string | null = match?.[1] ?? null;

  if (!args[0].includes("://youtu") || !videoId) {
    return sendReply(
      "Link yang anda berikan tidak valid. Silakan kirim link youtube yang valid.",
      invalidUrlButton
    );
  }

  allThumbnail(videoId, "", (thumbnails: Thumbnail) => {
    const { maxres, standard, high, medium, default: def } = thumbnails;
    const thumb = maxres ?? standard ?? high ?? medium ?? def ?? false;

    if (!thumb) return;

    const button = [
      [
        { text: "Audio", callback_data: `/youtube audio ${url}` },
        { text: "Video", callback_data: `/youtube video ${url}` },
      ],
    ];

    sendReply("Apa yang ingin anda download?", button, thumb);
  });
}
