import { MissingAdapterError } from "./MissingAdapterError";

export class Low {
  private data: any;
  private adapter: any;

  constructor(adapter: any) {
    this.data = null;
    if (!adapter) {
      throw new MissingAdapterError();
    }
    this.adapter = adapter;
  }

  async read() {
    this.data = await this.adapter.read();
  }

  async write() {
    if (this.data !== null) {
      await this.adapter.write(this.data);
    }
  }
}
