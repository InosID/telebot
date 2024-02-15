import { Bot } from '../../Types';

export function handleRequest(m: any, bot: Bot, userId: string, isUrl: any, args: any, messageId: any): void {
  bot.onRequest = bot.onRequest || {};

  const requestRecord = bot.onRequest[userId]

  if (requestRecord) {
    const { command } = requestRecord;

    switch (command) {
      case 'youtube':
        require('./youtube').youtube(m, isUrl, args);
        delete bot.onRequest[userId];
        break;
    }
  }
}
