"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = void 0;
function or(...args) {
    for (let arg of args) {
        if (arg !== undefined)
            return arg;
    }
    return undefined;
}
function parseOptions(optionsArgs, args = {}) {
    const options = {};
    const keys = Object.keys(optionsArgs);
    for (let key of keys) {
        options[key] = or(args[key], optionsArgs[key]);
    }
    return options;
}
exports.parseOptions = parseOptions;
