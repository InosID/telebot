import { RunParams, Attributes } from "../../src/Interfaces";

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
  name: "start",
  alias: ["menu", "help"],
  category: "main",
  async run({ m }: RunParams, { commands, l }: Attributes): Promise<void> {
    const categories: Record<string, string[]> = {};

    for (const command in commands) {
      const category = commands[command].category || "no category";
      if (!categories[category]) {
          categories[category] = [command];
      } else {
          if (categories[category].includes('hidden')) {
              continue; // Skip to the next iteration if category is 'hidden'
          }
          categories[category].push(command);
      }
  }  

    let str = '';
    for (const category in categories) {
      if (category == 'hidden') {
          continue;
      }
  
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