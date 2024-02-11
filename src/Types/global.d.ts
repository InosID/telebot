interface Command {
  [key: string]: any;
}

declare global {
  var attr: {
    [key: string]: Command;
  };
  function reloadFile(file?: string): void;
}

export { Command };
