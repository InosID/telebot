import { Schema, connect, model, Document, set } from 'mongoose';

set('strictQuery', true);

interface Data {
  data: any;
}

interface DataDocument extends Data, Document {}

export default class MongoDB {
  private url: string;
  private db: any;
  private _schema!: Schema<Data>;
  private _model: any;
  private _data: DataDocument | null;
  public data: any;

  constructor(url: string) {
    this.url = url;
    this.data = {};
    this._model = null;
    this._data = null;
  }

  async read(): Promise<any> {
    try {
      this.db = await connect(this.url);
      this._schema = new Schema<Data>({
        data: {
          type: Object,
          required: true,
          default: {}
        }
      });
      this._model = model<DataDocument>('data', this._schema);
      this._data = await this._model.findOne({});
      
      if (!this._data) {
        await this.write({});
        this._data = await this._model.findOne({});
      }
      
      if (this._data) { // Lakukan pemeriksaan apakah _data tidak null sebelum mengakses properti data
        this.data = this._data.data;
        return this.data;
      } else {
        console.error('Data not found');
        return null;
      }
    } catch (error) {
      console.error('Error reading from database:', error);
      return null;
    }
  }
  
  
  async write(data: any): Promise<void> {
    try {
      if (!this._model) {
        throw new Error('Model not initialized');
      }

      if (!this._data) {
        const newData = new this._model({ data });
        await newData.save();
      } else {
        const doc = await this._model.findById(this._data._id);
        if (!doc) {
          throw new Error('Document not found');
        }
        doc.data = data;
        await doc.save();
      }
    } catch (error) {
      console.error('Error writing to database:', error);
    }
  }
}
