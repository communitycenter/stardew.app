interface ReturnType {
  playerLevel: number;
  farmingLevel: number;
  fishingLevel: number;
  foragingLevel: number;
  miningLevel: number;
  combatLevel: number;
  SingularTalent: boolean; // true if Singular Talent is unlocked
  MasterOfTheFiveWays: boolean; // true if Master of the Five Ways is unlocked
}

export function parseSkills(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Singular Talent (level 10 in at least one skill).
      - Master of the Five Ways (level 10 in every skill).
  */

  // TODO: https://stardewvalleywiki.com/Skills#Skill-Based_Title (do we need this?)
  // we need the individual levels to determine the farmer level
  // so we're not going to use the skill XP for now since it would
  // complicate how to allow the same functionality when a user changes
  // their skill levels manually instead of by save file.
  const levels = [
    json.SaveGame.player.farmingLevel,
    json.SaveGame.player.fishingLevel,
    json.SaveGame.player.foragingLevel,
    json.SaveGame.player.miningLevel,
    json.SaveGame.player.combatLevel,
    json.SaveGame.player.luckLevel,
  ];

  // from the wiki, the formula for player level is: (farmingLevel + fishingLevel + foragingLevel + combatLevel + miningLevel + luckLevel) / 2
  // add all the numbers in levels with .reduce()
  let count: number = 0;
  // since we're looping through all the levels already, we can also track the count of levels that are 10 or higher
  const playerLevel = Math.floor(
    levels.reduce((prev, curr) => {
      if (curr >= 10) {
        count++;
      }
      return prev + curr;
    }, 0) / 2
  );

  return {
    playerLevel,
    farmingLevel: levels[0],
    fishingLevel: levels[1],
    foragingLevel: levels[2],
    miningLevel: levels[3],
    combatLevel: levels[4],
    SingularTalent: count >= 1,
    MasterOfTheFiveWays: count >= 5,
  };
}
