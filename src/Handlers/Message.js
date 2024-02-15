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
exports.Message = void 0;
const Utils_1 = require("../Utils");
require("../../settings");
const commands = global.attr;
function Message(m, bot) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const message = m.message;
        const text = (message.text || message.caption || '');
        const isMultiPrefix = !!((_a = process.env.MULTI_PREFIX) === null || _a === void 0 ? void 0 : _a.match(/true|ya|y(es)?/));
        const prefix = isMultiPrefix ? ((_b = text.match(/^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/gi)) !== null && _b !== void 0 ? _b : ['-'])[0] : (_c = process.env.PREFIX) !== null && _c !== void 0 ? _c : '-';
        const user = getUser(m.from);
        const args = text.trim().split(/ +/);
        const messageId = m.message.message_id;
        const cleanData = text.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '');
        const query = cleanData.trim().split(/ +/).slice(1).join(' ');
        const isPrivate = m.chat.type == 'private';
        const userId = m.message.from.id;
        const messageTypes = ['photo', 'video', 'audio', 'sticker', 'contact', 'location', 'document', 'animation'];
        let typeMessage = text.substr(0, 50).replace(/\n/g, '');
        for (const messageType of messageTypes) {
            if (message.hasOwnProperty(messageType)) {
                typeMessage = messageType.charAt(0).toUpperCase() + messageType.slice(1);
                break;
            }
        }
        let command = '';
        const trimmedData = cleanData.trim();
        const splitData = trimmedData.split(" ");
        if (splitData.length > 0) {
            command = (_e = (_d = splitData.shift()) === null || _d === void 0 ? void 0 : _d.toLowerCase()) !== null && _e !== void 0 ? _e : '';
        }
        const cmd = (0, Utils_1.findCommand)(commands, "alias", command);
        if (!cmd) {
            require('./Request').handleRequest(m, bot, userId, isUrl, args, messageId);
        }
        if (!cmd)
            return;
        if (!isPrivate && (cmd === null || cmd === void 0 ? void 0 : cmd.isPrivate)) {
            return bot.reply(message.chat.id, 'Fitur ini hanya dapat digunakan dalam private chat');
        }
        try {
            yield cmd.run({
                m,
                bot
            }, {
                query,
                commands,
                user,
                userId,
                isUrl,
                args,
                messageId
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.Message = Message;
function getUser(user) {
    try {
        const lastName = user["last_name"] || "";
        const fullName = user.first_name + " " + lastName;
        user["full_name"] = fullName.trim();
        return user;
    }
    catch (error) {
        throw error;
    }
}
function isUrl(url) {
    const urlPattern = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi");
    return url.match(urlPattern);
}
