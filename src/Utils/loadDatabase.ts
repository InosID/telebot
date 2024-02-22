import _ from 'lodash';
import MongoDB from '../Database';
import { Low } from '../Database/lowdb';

global.db = new Low(new MongoDB(process.env.MONGO_URI || ''));

export async function loadDatabase() {
  if (global.db.READ) {
    return new Promise<void>((resolve) => {
      let interval = setInterval(async () => {
        if (!global.db.READ) {
          clearInterval(interval);
          resolve(global.db.data == null ? loadDatabase() : global.db.data);
        }
      }, 1000);
    });
  }

  if (global.db.data !== null) return;

  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    user: {},
    ...(global.db.data || {}),
  };
  global.db.chain = _.chain(global.db.data);
}
