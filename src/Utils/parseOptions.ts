function or<T>(...args: (T | undefined)[]): T | undefined {
  for (let arg of args) {
    if (arg !== undefined) return arg;
  }
  return undefined;
}

export function parseOptions<T extends Record<string, any>>(
  optionsArgs: T,
  args: Partial<T> = {}
): T {
  const options: T = {} as T;
  const keys = Object.keys(optionsArgs) as (keyof T)[];
  for (let key of keys) {
    options[key] = or(args[key], optionsArgs[key]) as T[keyof T];
  }
  return options;
}
