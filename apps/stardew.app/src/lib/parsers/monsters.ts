import type { MonsterGoal } from "@/types/data";

import monstersData from "@/data/monsters.json";

export const monsters = monstersData as Record<string, MonsterGoal>;

function getMonstersKilled(specificMonstersKilled: any): Map<string, number> {
  /*
  Loop though player.stats.specificMonstersKilled and return a map of the monsters killed
  We'll later look up the monster names to mimic the game's source code.

  Returns:
    Map<string, number> - Map of the monsters killed
  */

  const stats = new Map<string, number>();

  if (!specificMonstersKilled) {
    return stats;
  }

  try {
    if (Array.isArray(specificMonstersKilled.item)) {
      // multiple types of monsters killed
      for (const monster of specificMonstersKilled.item) {
        const name = monster.key.string;
        const count = parseInt(monster.value.int);
        stats.set(name, count);
      }
    } else {
      // only one type of monster killed
      const name = specificMonstersKilled.item.key.string;
      const count = parseInt(specificMonstersKilled.item.value.int);
      stats.set(name, count);
    }
    return stats;
  } catch (err) {
    if (err instanceof TypeError)
      throw new Error(`Error iterating specificMonstersKilled: ${err.message}`);
    else throw err;
  }
}

export interface MonstersRet {
  deepestMineLevel?: number;
  deepestSkullCavernLevel?: number;
  monstersKilled: Record<string, number>;
}

export const parseMonsters = (player: any): MonstersRet => {
  /*
    Achievements Relevant:
      - The Bottom (reach mine level 120).
      - Protector of the Valley (complete all monster slayer goals)
  */

  // deepestMineLevel goes past 120 in skull cavern
  try {
    let deepestMineLevel = player.deepestMineLevel;
    let deepestSkullCavernLevel = Math.max(129, deepestMineLevel) - 120;
    deepestMineLevel = Math.min(120, deepestMineLevel);

    const monstersKilled: Record<string, number> = {};
    // initialize monstersKilled with 0 for each goal
    Object.keys(monsters).forEach((key) => {
      monstersKilled[key] = 0;
    });

    const stats = getMonstersKilled(player.stats.specificMonstersKilled);
    // no monsters killed yet
    if (stats.size === 0) {
      return {
        deepestMineLevel,
        deepestSkullCavernLevel,
        monstersKilled,
      };
    }

    // mimic game code to determine which category the monster belongs to
    // Reference: StardewValley.AdventureGuild.cs::showMonsterKillList()
    // loop through each key/value pair in monsters.json and look up the amount killed
    for (const key in monsters) {
      const goal = monsters[key];
      let runningTotal = 0;

      // go through each of the targets and look up the amount killed
      for (const monster of goal.targets) {
        // dangerous versions of monsters are added to the non-dangerous version
        if (monster.endsWith(" (dangerous)")) continue;

        let target = monster;
        if (monster === "Slimes") {
          // Since we renamed the "Green Slime" target to "Slimes" to avoid confusion, we can rename it here and get the correct counts
          target = "Green Slime";
        }

        const killed = stats.get(target) ?? 0;
        runningTotal += killed;
      }
      monstersKilled[key] = runningTotal;
    }

    return {
      deepestMineLevel,
      deepestSkullCavernLevel,
      monstersKilled,
    };
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parseMonsters: ${e.message}`);
    throw new Error(`Error in parseMonsters: ${e}`);
  }
};
