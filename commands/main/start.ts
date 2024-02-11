export default {
  name: "start",
  alias: ["menu", "allmenu"],
  category: "main",
  example: "",
  async run({ m }: { m: any }) {
    m.reply('hi');
    console.log(m)
  }
};