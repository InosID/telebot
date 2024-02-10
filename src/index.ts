import '../settings';
import fs from 'fs';
import path from 'path';
import { parseOptions } from "./Utils";
import { Attribute, Command } from './Types';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

const attr: Attribute = {
  uptime: new Date(),
  command: new Map<string, Command>()
};

(async function(directory: string): Promise<void> {
  try {
    const pathDir = path.join(__dirname, directory);
    const features = fs.readdirSync(pathDir);
    console.log("Loading... Please wait while the system checks the commands.");
    for (const feature of features) {
      const commands = fs.readdirSync(path.join(pathDir, feature)).filter((file) => file.endsWith(".js"));
      for (const file of commands) {
        const command: Command = require(path.join(pathDir, feature, file));
        if (typeof command.run !== "function") continue;
        const defaultCmdOptions = {
          name: "command",
          alias: [""],
          desc: "",
          use: "",
          example: "",
          url: "",
          category: command.category === undefined ? "" : feature.toLowerCase(),
          wait: false,
          isOwner: false,
          isAdmin: false,
          isQuoted: false,
          isGroup: false,
          isBotAdmin: false,
          isQuery: false,
          isPrivate: false,
          isUrl: false,
          run: () => {},
        };
        const cmdOptions = parseOptions(defaultCmdOptions, command);
        const options = Object.fromEntries(
          Object.entries(cmdOptions)
            .filter(([k, v]) => typeof v === "boolean" || k === "query" || k === "isMedia")
        );
        const cmdObject: Command = {
          name: cmdOptions.name,
          alias: cmdOptions.alias,
          desc: cmdOptions.desc,
          use: cmdOptions.use,
          type: cmdOptions.type || "",
          example: cmdOptions.example,
          url: cmdOptions.url,
          category: cmdOptions.category,
          options,
          run: cmdOptions.run,
        };
        attr.command.set(cmdOptions.name, cmdObject);
        global.reloadFile(`./${directory}/${feature}/${file}`);
      }
    }
    console.log("Loading... Command loaded successfully.");
  } catch (error) {
    console.error("Error: ", error);
  }
})('../commands');

const TOKEN = process.env.TOKEN ? process.env.TOKEN : ""
const bot = new Telegraf<Context<Update>>(TOKEN)

function connect() {
  bot.on("callback_query", function(m) {
    require('./Handlers/callback')(m, bot, attr)
  })
  bot.on("message", function(m) {
    console.log(m)
  })
  bot.launch({
    dropPendingUpdates: true,
  })
}

connect()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))