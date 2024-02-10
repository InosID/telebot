function or(...args: any[]): any {
  for (let arg of args) {
    if (arg) return arg;
  }
  return args[args.length - 1];
}

interface OptionsArgs {
  [key: string]: any;
}

interface Args {
  [key: string]: any;
}

export default function parseOptions(optionsArgs: OptionsArgs = {}, args: Args = {}): OptionsArgs {
  let options: OptionsArgs = {};
  let entries = Object.entries(optionsArgs);
  for (let i = 0; i < Object.keys(optionsArgs).length; i++) {
    let [key, val] = entries[i];
    options[key] = or(args[key], val);
  }
  return options;
}
