import * as fs from 'fs';

function uncache(module: string = "."): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      delete require.cache[require.resolve(module)];
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export default function nocache(module: string, cb: (module: string) => void = () => {}): void {
  fs.watchFile(require.resolve(module), async () => {
    await uncache(require.resolve(module));
    cb(module);
  });
}