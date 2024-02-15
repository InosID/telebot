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
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Starting...');
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
let isProcessRunning = false;
function startProcess(fileToStart) {
    if (isProcessRunning)
        return;
    isProcessRunning = true;
    const processArguments = [path.join(__dirname, fileToStart), ...process.argv.slice(2)];
    const childProcess = (0, child_process_1.spawn)(process.argv[0], processArguments, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    });
    childProcess.on('message', (data) => {
        console.log('[MESSAGE RECEIVED]', data);
        switch (data) {
            case 'reset':
                childProcess.kill();
                isProcessRunning = false;
                startProcess(fileToStart);
                break;
            case 'uptime':
                childProcess.send(process.uptime());
                break;
        }
    });
    childProcess.on('exit', (code) => {
        isProcessRunning = false;
        console.error('Process exited with code:', code);
        startProcess(fileToStart);
    });
}
startProcess("src");
