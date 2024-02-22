export function parseOptions<T extends Record<string, any>>(
  optionsArgs: T,
  args: Partial<T> = {}
): T {
  const options: T = {} as T;
  const keys = Object.keys(optionsArgs) as (keyof T)[];
  for (const key of keys) {
    if (args[key] !== undefined) {
      options[key] = args[key]!;
    } else {
      options[key] = optionsArgs[key];
    }
  }
  return options;
}
