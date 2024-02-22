import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import express, { Application, Request, Response } from 'express';
import nocache from './src/Utils/cache';

const app: Application = express()
const PORT = process.env.PORT || 3000

console.log(require('./src/Database'))
console.log('Starting...');

let isProcessRunning: boolean = false;

global.reloadFile = function(file: string = ''): void {
  nocache(file, () => {
    console.log(`File "${file}" has been updated!\nRestarting!`);
    process.send?.("reset");
  });
};

async function startProcess(fileToStart: string): Promise<void> {
  if (isProcessRunning) return;
  isProcessRunning = true;

  const processArguments: string[] = [path.join(__dirname, fileToStart), ...process.argv.slice(2)];

  const childProcess: ChildProcess = spawn(process.argv[0], processArguments, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });

  childProcess.on('message', async (data: string | number) => {
    console.log('[MESSAGE RECEIVED]', data);

    switch (data) {
      case 'reset':
        childProcess.kill();
        isProcessRunning = false;
        await startProcess(fileToStart);
        break;
      case 'uptime':
        childProcess.send(process.uptime());
        break;
    }
  });

  childProcess.on('exit', (code: number | null) => {
    isProcessRunning = false;
    console.error('Process exited with code:', code);
    startProcess(fileToStart);
  });
}

async function main(): Promise<void> {
  try {
    await startProcess("src");
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

main();

app.set("json spaces", 2);
app.get("*", async (req: Request, res: Response) => {
  res.json({
    online: true,
  });
});

app.listen(PORT, () => console.log(`Server running with port ${PORT}!`));