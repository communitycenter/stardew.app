interface ReturnType {
  levels: { [key: string]: number };
  maxLevelCount: number; // can be used for determining achievement completion
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
  const skillLevels = [
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
    skillLevels.reduce((prev, curr) => {
      if (curr >= 10) {
        count++;
      }
      return prev + curr;
    }, 0) / 2
  );

  const levels = {
    Player: playerLevel,
    Farming: skillLevels[0],
    Fishing: skillLevels[1],
    Foraging: skillLevels[2],
    Mining: skillLevels[3],
    Combat: skillLevels[4],
    Luck: skillLevels[5],
  };

  return {
    levels,
    maxLevelCount: count,
  };
}
