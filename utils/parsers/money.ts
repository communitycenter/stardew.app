const { XMLParser } = require("fast-xml-parser");

const parser = new XMLParser();

interface ReturnProps {
  moneyEarned: number;
  balance: number;
}

export function parseMoney(xml: string): ReturnProps {
  const json = parser.parse(xml);
  const moneyEarned: number = json.SaveGame.player.totalMoneyEarned;
  const balance: number = json.SaveGame.player.money;

  return { moneyEarned, balance };
}