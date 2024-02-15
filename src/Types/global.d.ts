interface Command {
  [key: string]: any;
}

declare global {
  var attr: {
    [key: string]: Command;
  };
  function reloadFile(file?: string): void;
}

global.reloadFile = function(file: string = ''): void {
  nocache(file, () => {
    console.log(`File "${file}" has been updated!\nRestarting!`);
    process.send?.("reset");
  });
};

function nocache(module: string, cb: (module: string) => void = () => {}): void {
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

export { Command };