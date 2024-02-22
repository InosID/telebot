import { LOGGER } from '../settings';
import { CommandAttr } from './Interfaces/global';
import fs from 'fs';
import path from 'path';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { loadDatabase } from './Utils';

global.attr = {};

async function loadCommands(): Promise<void> {
  const commandsPath = path.join(__dirname, "../commands");
  const plugins = fs.readdirSync(commandsPath);

  for (const plugin of plugins) {
    if (!/\.js$/g.test(plugin)) {
      const commandFiles = fs.readdirSync(path.join(commandsPath, plugin))
        .filter((file) => file.endsWith('.js'));

      for (const filename of commandFiles) {
        const pathFiles = path.join(commandsPath, plugin, filename);

        try {
          const commandModule: CommandAttr = await import(`${pathFiles}`);
          const command = commandModule.default;
          global.attr[filename.replace('.js', '')] = command;
        } catch (error: any) {
          console.error(`Error loading command file ${pathFiles}: ${error.message}`);
        }
      }
    }
  }
}



async function connect(bot: Telegraf<Context<Update>>, token: string): Promise<void> {
  try {
    console.log(LOGGER.connection.start.replace("%botname", (await bot.telegram.getMe()).first_name));

    bot.on("callback_query", (m) => {
      require('./Handlers').Callback(m, bot, LOGGER);
    });

    bot.on("message", (m) => {
      require('./Handlers').Message(m, bot, LOGGER);
    });

    bot.launch({
      dropPendingUpdates: true,
    });

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function main(): Promise<void> {
  try {
    await loadCommands();

    await loadDatabase();
    if (global.db) {
      let interval = setInterval(async function() {
        if (global.db.data) await global.db.write();
      }, 5 * 1000);
    }

    const TOKEN: string | undefined = process.env.TOKEN;

    if (TOKEN === undefined || TOKEN.match(/( |BOT_TOKEN)/)) {
      console.log(LOGGER.connection.error.invalid_token);
      return;
    }

    const bot: Telegraf<Context<Update>> = new Telegraf<Context<Update>>(TOKEN ?? '');
    await connect(bot, TOKEN);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main();
