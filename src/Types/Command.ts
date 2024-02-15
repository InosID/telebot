import { Bot } from ".";

export interface Command {
  alias?: string[];
  category?: string,
  desc?: string,
  isPrivate?: boolean;
  run: (
    context: RunParams,
    attributes: Attributes
  ) => Promise<void>;
}

export interface RunParams {
  m?: any;
  bot?: any;
}

export interface Attributes {
  query?: string;
  commands?: any;
  user?: any;
  userId?: any;
  isUrl?: any;
  args?: any;
  messageId?: any;
  chatId?: any;
}
