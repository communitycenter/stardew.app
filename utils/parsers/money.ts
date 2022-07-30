interface ReturnType {
  moneyEarned: number;
  // balance: number;
  Greenhorn: boolean;
  Cowpoke: boolean;
  Homesteader: boolean;
  Millionaire: boolean;
  Legend: boolean;
}

export function parseMoney(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Greenhorn:    Earned 15,000g.
      - Cowpoke:      Earned 50,000g.
      - Homesteader:  Earned 250,000g.
      - Millionaire:  Earned 1,000,000g
      - Legend:       Earned 10,000,000g
  */
  const moneyEarned: number = json.SaveGame.player.totalMoneyEarned;
  // const balance: number = json.SaveGame.player.money;

  return {
    moneyEarned,
    Greenhorn: moneyEarned >= 15000,
    Cowpoke: moneyEarned >= 50000,
    Homesteader: moneyEarned >= 250000,
    Millionaire: moneyEarned >= 1000000,
    Legend: moneyEarned >= 10000000,
  };
}
