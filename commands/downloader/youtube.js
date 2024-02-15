"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scraper_1 = require("../../src/Scraper");
exports.default = {
    alias: ["yt"],
    desc: "youtube video/audio download",
    category: "downloader",
    run({ m, bot }, { query, userId, chatId, args, messageId, isUrl }) {
        return __awaiter(this, void 0, void 0, function* () {
            bot.onRequest = bot.onRequest ? bot.onRequest : {};
            if (query) {
                switch (args[1]) {
                    case 'cancel':
                        m.editMessageReplyMarkup({}, {
                            chat_id: chatId,
                            message_id: m.update.callback_query.message.message_id
                        });
                        if (bot.onRequest[userId]) {
                            delete bot.onRequest[userId];
                            m.reply('Permintaan download youtube dibatalkan.');
                        }
                        break;
                    case 'audio':
                        if (bot.onRequest[userId]) {
                            delete bot.onRequest[userId];
                        }
                        m.editMessageReplyMarkup({}, {
                            chat_id: chatId,
                            message_id: m.update.callback_query.message.message_id
                        });
                        m.reply('Audio telah dipilih. Mohon tunggu, audio sedang dikirim...');
                        var res = yield (0, Scraper_1.ytmp3)(args[2]);
                        var { url } = res;
                        m.replyWithAudio({ url: url }, { reply_to_message_id: messageId });
                        break;
                    case 'video':
                        if (bot.onRequest[userId]) {
                            delete bot.onRequest[userId];
                        }
                        m.editMessageReplyMarkup({}, {
                            chat_id: chatId,
                            message_id: m.update.callback_query.message.message_id
                        });
                        m.reply('Video telah dipilih. Mohon tunggu, video sedang dikirim...');
                        var res = yield (0, Scraper_1.ytmp4)(args[2]);
                        var { url } = res;
                        m.replyWithVideo({ url: url }, { reply_to_message_id: messageId });
                        break;
                    default:
                        if (bot.onRequest[userId]) {
                            delete bot.onRequest[userId];
                        }
                        if (isUrl(args[1])) {
                            const button = [
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
                        }
                        else {
                            m.reply('Tolong berikan url dengan benar!');
                            bot.onRequest[userId] = {
                                command: "youtube"
                            };
                        }
                }
            }
            else {
                bot.onRequest[userId] = {
                    command: "youtube"
                };
                m.reply('Kirim linknya kak');
            }
        });
    }
};
