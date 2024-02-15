"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../settings");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const telegraf_1 = require("telegraf");
global.attr = {};
function loadCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandsPath = "./commands";
        const plugins = fs_1.default.readdirSync(commandsPath);
        for (const plugin of plugins) {
            if (!/\.js$/g.test(plugin)) {
                const commandFiles = fs_1.default
                    .readdirSync(path_1.default.join(commandsPath, plugin))
                    .filter((file) => file.endsWith(".js"));
                for (const filename of commandFiles) {
                    const pathFiles = path_1.default.join(commandsPath, plugin, filename);
                    try {
                        const commandModule = yield Promise.resolve(`${`../${pathFiles}`}`).then(s => __importStar(require(s)));
                        const command = commandModule.default;
                        global.attr[`${filename.replace('.js', '')}`] = command;
                    }
                    catch (error) {
                        console.error(`Error loading command file ${pathFiles}: ${error.message}`);
                    }
                }
            }
        }
    });
}
loadCommands();
const TOKEN = process.env.TOKEN || "";
const bot = new telegraf_1.Telegraf(TOKEN);
function connect() {
    bot.on("callback_query", function (m) {
        require('./Handlers').Callback(m, bot);
    });
    bot.on("message", function (m) {
        require('./Handlers').Message(m, bot);
    });
    bot.launch({
        dropPendingUpdates: true,
    });
}
connect();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
