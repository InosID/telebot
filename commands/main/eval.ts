import { Attributes, RunParams } from "src/Interfaces"

export default {
  name: "eval",
  alias: [">"],
  category: "hidden",
  isOwner: true,
  async run({ m, bot }: RunParams, { text, query, args, type, isUrl, message }: Attributes) {
    console.log('called')
    let kode = text.trim().split(/ +/)[0];
    let teks;
    try {
      teks = await eval(
        `(async () => { ${kode == ">" ? "return" : ""} ${query}})()`
      );
      console.log(teks)
    } catch (e) {
      teks = e;
      console.log(e)
    } finally {
      await m.reply(require("util").format(teks));
    }
  }
};
