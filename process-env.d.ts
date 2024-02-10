declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT: string;
      TOKEN: string;
      PREFIX: string;
      MULTI_PREFIX: string;
    }
  }
}