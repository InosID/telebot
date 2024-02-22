interface CommandAttr {
  [key: string]: any;
}

declare global {
  var db: any;
  var DATABASE: any;
  var attr: {
    [key: string]: CommandAttr;
  };
  function reloadFile(file?: string): void;
}

export { CommandAttr };
