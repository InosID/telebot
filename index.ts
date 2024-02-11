console.log('Starting...');
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

let isProcessRunning: boolean = false;

function startProcess(fileToStart: string): void {
  if (isProcessRunning) return;
  isProcessRunning = true;

  const processArguments: string[] = [path.join(__dirname, fileToStart), ...process.argv.slice(2)];
  const childProcess: ChildProcess = spawn(process.argv[0], processArguments, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });

  childProcess.on('message', (data: any) => {
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

  childProcess.on('exit', (code: number | null) => {
    isProcessRunning = false;
    console.error('Process exited with code:', code);
    startProcess(fileToStart);
  });
}

startProcess("src");
