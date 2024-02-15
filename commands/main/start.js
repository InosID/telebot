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
const template = {
    top: "╭⌥ *%category*",
    body: "│ ⠂ %cmd",
    bottom: "╰────────"
};
exports.default = {
    alias: ["menu", "help"],
    category: "main",
    run({ m }, { commands }) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = {};
            for (const command in commands) {
                const category = commands[command].category || "no category";
                if (!categories[category]) {
                    categories[category] = [command];
                }
                else {
                    categories[category].push(command);
                }
            }
            let str = '';
            for (const category in categories) {
                str += `${template.top.replace('%category', category.toUpperCase())}\n`;
                categories[category].forEach(command => {
                    const desc = commands[command].desc ? '\\- ' + commands[command].desc : '';
                    str += `${template.body.replace('%cmd', '/' + command.toLowerCase()).replace('%desc', desc)}\n`;
                });
                str += `${template.bottom}\n`;
            }
            m.replyWithMarkdownV2(str);
        });
    }
};
