"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtube = void 0;
const telegraf_1 = require("telegraf");
const Scraper_1 = require("../../Scraper");
function youtube(m, isUrl, args, messageId) {
    var _a;
    console.log(args);
    if (isUrl(m.message.text)) {
        const url = m.message.text;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\?si=([\w-]+))?/);
        const videoId = (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : null;
        if (args[0].match("://youtu") && videoId) {
            (0, Scraper_1.allThumbnail)(videoId, '', (thumbnails) => {
                const { maxres, standard, high, medium, default: def } = thumbnails;
                const thumb = maxres ? maxres : standard ? standard : high ? high : medium ? medium : def ? def : false;
                if (thumb) {
                    const button = [
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
                    m.replyWithPhoto(telegraf_1.Input.fromURL(thumb), {
                        caption: "Apa yang ingin anda download?",
                        reply_markup: {
                            inline_keyboard: button
                        }
                    }, {
                        reply_to_message_id: messageId
                    });
                }
            });
        }
        else {
            const button = [
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
    }
    else {
        const button = [
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
exports.youtube = youtube;
