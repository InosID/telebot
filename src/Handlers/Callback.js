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
exports.Callback = void 0;
const Utils_1 = require("../Utils");
require("../../settings");
const commands = global.attr;
function Callback(m, bot) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const message = m;
        const data = message.callbackQuery.data;
        console.log(data);
        const isMultiPrefix = !!((_a = process.env.MULTI_PREFIX) === null || _a === void 0 ? void 0 : _a.match(/true|ya|y(es)?/));
        const prefix = isMultiPrefix ? data[0] : process.env.PREFIX || '';
        const cleanData = data.replace(prefix, '');
        const query = cleanData.trim().split(/ +/).slice(1).join(' ');
        const user = getUser(m.update.callback_query.from);
        const commandName = (_b = cleanData.trim().split(/ +/).shift()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        const userId = m.update.callback_query.from.id;
        const args = data.trim().split(/ +/);
        const messageId = m.update.callback_query.message.message_id;
        let command = '';
        const trimmedData = cleanData.trim();
        const splitData = trimmedData.split(" ");
        if (splitData.length > 0) {
            command = (_d = (_c = splitData.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : '';
        }
        const cmd = (0, Utils_1.findCommand)(commands, "alias", command);
        if (!cmd)
            return;
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
exports.Callback = Callback;
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
