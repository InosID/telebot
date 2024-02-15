"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
function handleRequest(m, bot, userId, isUrl, args, messageId) {
    bot.onRequest = bot.onRequest || {};
    const requestRecord = bot.onRequest[userId];
    if (requestRecord) {
        const { command } = requestRecord;
        switch (command) {
            case 'youtube':
                require('./youtube').youtube(m, isUrl, args, messageId);
                delete bot.onRequest[userId];
                break;
        }
    }
}
exports.handleRequest = handleRequest;
