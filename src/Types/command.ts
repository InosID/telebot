export interface CommandOptions {
  name: string;
  alias: string[];
  desc: string;
  use: string;
  example: string;
  url: string;
  category: string;
  wait: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isQuoted: boolean;
  isGroup: boolean;
  isBotAdmin: boolean;
  isQuery: boolean;
  isPrivate: boolean;
  isUrl: boolean;
  run: () => void;
}

export interface Command {
  name: string;
  alias: string[];
  desc: string;
  use: string;
  type: string;
  example: string;
  url: string;
  category: string;
  options: Record<string, any>;
  run: () => void;
}

export interface Attribute {
  uptime: Date;
  command: Map<string, Command>;
}