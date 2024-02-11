export default {
  name: "start",
  alias: [],
  category: "main",
  async run({ m }: { m: any }) {
    m.reply('hi');
    console.log(m) // test
  }
};
