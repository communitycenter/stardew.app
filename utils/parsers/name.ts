const { XMLParser } = require("fast-xml-parser");

const parser = new XMLParser();

export function parseName(xml: string): string {
  const json = parser.parse(xml);
  const name = json.SaveGame.player.name;
  return name;
}
