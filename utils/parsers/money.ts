export function parseMoney(json: any): number {
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

  return moneyEarned;
}
