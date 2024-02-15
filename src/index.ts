import '../settings';
import fs from 'fs';
import path from 'path';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Command } from './Types/global';

global.attr = {};

async function loadCommands(): Promise<void> {
  const commandsPath = "./commands";
  const plugins = fs.readdirSync(commandsPath);
  for (const plugin of plugins) {
    if (!/\.js$/g.test(plugin)) {
      const commandFiles = fs
        .readdirSync(path.join(commandsPath, plugin))
        .filter((file) => file.endsWith(".js"));
      for (const filename of commandFiles) {
        const pathFiles = path.join(commandsPath, plugin, filename);
        try {
          const commandModule = await import(`../${pathFiles}`);
          const command: Command = commandModule.default;
          global.attr[`${filename.replace('.js', '')}`] = command;
        } catch (error: any) {
          console.error(
            `Error loading command file ${pathFiles}: ${error.message}`
          );
        }
      }
    }
  }
}

loadCommands();

const TOKEN: string = process.env.TOKEN || "";
const bot: Telegraf<Context<Update>> = new Telegraf<Context<Update>>(TOKEN);

function connect(): void {
  bot.on("callback_query", function(m) {
    require('./Handlers').Callback(m, bot);
  });
  bot.on("message", function(m) {
    require('./Handlers').Message(m, bot);
  });
  bot.launch({
    dropPendingUpdates: true,
  });
}

connect();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
