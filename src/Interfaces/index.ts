import mongoose, { Document } from "mongoose";

export interface Bot {
  [key: string]: any;
}

export interface Command {
  name: string;
  alias: string[];
  category?: string,
  desc?: string,
  isPrivate?: boolean;
  isOwner?: boolean;
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
  text?: any;
  query?: string;
  commands?: any;
  user?: any;
  userId?: any;
  isUrl?: any;
  args?: any;
  messageId?: any;
  chatId?: any;
  type: any;
  message: any;
  l: any;
}

export interface RequestOptions {
  m: any;
  bot: Bot;
  userId: number;
  isUrl: (url: string) => RegExpMatchArray | null;
  args: string[];
  messageId: number;
}

export interface User {
  id?: number;
  is_bot?: boolean;
  first_name?: string;
  username?: string;
  language_code?: string;
}

export interface RequestRecord {
  command: string;
}

export interface MongoDBDocument extends Document {
  _id: mongoose.Types.ObjectId;
  data: Record<string, any>;
}