import { User } from "./User";

export interface Message {
  text?: string;
  from: User,
  caption?: string;
  photo?: any;
  video?: any;
  audio?: any;
  sticker?: any;
  contact?: any;
  location?: any;
  document?: any;
  animation?: any;
  chat: any;
}

export interface MessageCallback {
  callbackQuery: {
    data: string;
  };
  text?: string;
  from: User,
  caption?: string;
  photo?: any;
  video?: any;
  audio?: any;
  sticker?: any;
  contact?: any;
  location?: any;
  document?: any;
  animation?: any;
  chat: any;
}