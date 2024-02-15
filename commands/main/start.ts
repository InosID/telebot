import { RunParams, Attributes } from "../../src/Types";

interface Template {
  top: string;
  body: string;
  bottom: string;
}

const template: Template = {
  top: "╭⌥ *%category*",
  body: "│ ⠂ %cmd",
  bottom: "╰────────"
};

export default {
  alias: ["menu", "help"],
  category: "main",
  async run({ m }: RunParams, { commands }: Attributes) {
    const categories: Record<string, string[]> = {};

    for (const command in commands) {
      const category = commands[command].category || "no category";
      if (!categories[category]) {
        categories[category] = [command];
      } else {
        categories[category].push(command);
      }
    }

    let str = '';
    for (const category in categories) {
      str += `${template.top.replace('%category', category.toUpperCase())}\n`;
      categories[category].forEach(command => {
        const desc = commands[command].desc ? '\\- ' + commands[command].desc : ''
        str += `${template.body.replace('%cmd', '/' + command.toLowerCase()).replace('%desc', desc)}\n`;
      });
      str += `${template.bottom}\n`
    }
    
    m.replyWithMarkdownV2(str)
  }
};