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

type category =
  | "Slimes"
  | "Void Spirits"
  | "Bats"
  | "Skeletons"
  | "Cave Insects"
  | "Duggies"
  | "Dust Sprites"
  | "Rock Crabs"
  | "Mummies"
  | "Pepper Rex"
  | "Serpents"
  | "Magma Sprites";

export interface MonstersRet {
  deepestMineLevel: number;
  deepestSkullCavernLevel: number;
  monstersKilled: Record<category, number>;
}

export const parseMonsters = (player: any): MonstersRet => {
  /*
    Achievements Relevant:
      - The Bottom (reach mine level 120).
      - Protector of the Valley (complete all monster slayer goals)
  */

  // deepestMineLevel goes past 120 in skull cavern
  let deepestMineLevel = player.deepestMineLevel;
  let deepestSkullCavernLevel = Math.max(129, deepestMineLevel) - 120;
  deepestMineLevel = Math.min(120, deepestMineLevel);

  let monstersKilled: Record<category, number> = {
    Slimes: 0,
    "Void Spirits": 0,
    Bats: 0,
    Skeletons: 0,
    "Cave Insects": 0,
    Duggies: 0,
    "Dust Sprites": 0,
    "Rock Crabs": 0,
    Mummies: 0,
    "Pepper Rex": 0,
    Serpents: 0,
    "Magma Sprites": 0,
  };

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
  monstersKilled["Slimes"] = // slimesKilled
    (stats.get("Green Slime") ?? 0) +
    (stats.get("Frost Jelly") ?? 0) +
    (stats.get("Sludge") ?? 0) +
    (stats.get("Tiger Slime") ?? 0);

  monstersKilled["Void Spirits"] = // shadowsKilled
    (stats.get("Shadow Guy") ?? 0) +
    (stats.get("Shadow Shaman") ?? 0) +
    (stats.get("Shadow Brute") ?? 0) +
    (stats.get("Shadow Sniper") ?? 0);

  monstersKilled["Skeletons"] = // skeletonsKilled
    (stats.get("Skeleton") ?? 0) + (stats.get("Skeleton Mage") ?? 0);

  monstersKilled["Rock Crabs"] = // crabsKilled
    (stats.get("Rock Crab") ?? 0) +
    (stats.get("Lava Crab") ?? 0) +
    (stats.get("Iridium Crab") ?? 0);

  monstersKilled["Cave Insects"] = // caveInsectsKilled
    (stats.get("Grub") ?? 0) +
    (stats.get("Fly") ?? 0) +
    (stats.get("Bug") ?? 0);

  monstersKilled["Bats"] = // batsKilled
    (stats.get("Bat") ?? 0) +
    (stats.get("Frost Bat") ?? 0) +
    (stats.get("Lava Bat") ?? 0) +
    (stats.get("Iridium Bat") ?? 0);

  monstersKilled["Duggies"] = // duggyKilled
    (stats.get("Duggy") ?? 0) + (stats.get("Magma Duggy") ?? 0);

  monstersKilled["Dust Sprites"] = stats.get("Dust Spirit") ?? 0; // dustSpiritKilled

  monstersKilled["Mummies"] = stats.get("Mummy") ?? 0; // mummiesKilled

  monstersKilled["Pepper Rex"] = stats.get("Pepper Rex") ?? 0; // dinosKilled

  monstersKilled["Serpents"] = // serpentsKilled
    (stats.get("Serpent") ?? 0) + (stats.get("Royal Serpent") ?? 0);

  monstersKilled["Magma Sprites"] = // flameSpiritsKilled
    (stats.get("Magma Sprite") ?? 0) + (stats.get("Magma Sparker") ?? 0);

  return {
    deepestMineLevel,
    deepestSkullCavernLevel,
    monstersKilled,
  };
};
