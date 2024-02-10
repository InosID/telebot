import fs from 'fs';

global.reloadFile = function(file: string = '') {
  nocache(file, () => {
    console.log(`File "${file}" has been updated!\nRestarting!`);
    process.send?.("reset");
  });
};

function nocache(module: string, cb: (module: string) => void = () => {}) {
  fs.watchFile(require.resolve(module), async () => {
    await uncache(require.resolve(module));
    cb(module);
  });
}

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