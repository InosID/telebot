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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
global.reloadFile = function (file = '') {
    nocache(file, () => {
        var _a;
        console.log(`File "${file}" has been updated!\nRestarting!`);
        (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, "reset");
    });
};
function nocache(module, cb = () => { }) {
    fs_1.default.watchFile(require.resolve(module), () => __awaiter(this, void 0, void 0, function* () {
        yield uncache(require.resolve(module));
        cb(module);
    }));
}
function uncache(module = ".") {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)];
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}
