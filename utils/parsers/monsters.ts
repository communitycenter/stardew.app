interface ReturnType {
  deepestMineLevel: number;
  deepestSkullCavernLevel: number;
  monstersKilled: Record<category, number>;
}

type MonsterName = string;
type category =
  | "slimes"
  | "void spirits"
  | "bats"
  | "skeletons"
  | "cave insects"
  | "duggies"
  | "dust sprites"
  | "rock crabs"
  | "mummies"
  | "pepper rex"
  | "serpents"
  | "magma sprites";

// a way to map monsters to their categories for their goals
const categories: Record<MonsterName, category> = {
  "Green Slime": "slimes",
  "Frost Jelly": "slimes",
  Sludge: "slimes",
  "Tiger Slime": "slimes",
  "Shadow Shaman": "void spirits",
  "Shadow Brute": "void spirits",
  Bat: "bats",
  "Frost Bat": "bats",
  "Lava Bat": "bats",
  "Iridium Bat": "bats",
  Skeleton: "skeletons",
  "Skeleton Mage": "skeletons",
  Bug: "cave insects",
  Fly: "cave insects",
  Grub: "cave insects",
  Duggy: "duggies",
  "Magma Duggy": "duggies",
  "Dust Spirit": "dust sprites",
  "Rock Crab": "rock crabs",
  "Lava Crab": "rock crabs",
  "Iridium Crab": "rock crabs",
  Mummy: "mummies",
  "Pepper Rex": "pepper rex",
  Serpent: "serpents",
  "Royal Serpent": "serpents",
  "Magma Sprite": "magma sprites",
  "Magma Sparker": "magma sprites",
};

// These are the goals that are listed at the Adventure Guild
const goals: Record<category, number> = {
  slimes: 1000,
  "void spirits": 150,
  bats: 200,
  skeletons: 50,
  "cave insects": 125,
  duggies: 30,
  "dust sprites": 50,
  "rock crabs": 60,
  mummies: 100,
  "pepper rex": 50,
  serpents: 250,
  "magma sprites": 150,
};

export function parseMonsters(json: any): ReturnType {
  /*
    Achievements Relevant:
      - The Bottom (reach mine level 120).
      - Protector of the Valley (complete all monster slayer goals)
  */

  let deepestMineLevel = json.SaveGame.player.deepestMineLevel;
  // deepestMineLevel goes past 120 when you enter skull caverns.
  // so if deepestMineLevel is 125, that means the player has reached level 5 in skull cavern.
  let deepestSkullCavernLevel = Math.max(120, deepestMineLevel) - 120;
  // now that we found the skull cavern level, we can set deepestMineLevel to 120 or if its lower, that value.
  deepestMineLevel = Math.min(120, deepestMineLevel);

  const monstersKilled = {
    slimes: 0,
    "void spirits": 0,
    bats: 0,
    skeletons: 0,
    "cave insects": 0,
    duggies: 0,
    "dust sprites": 0,
    "rock crabs": 0,
    mummies: 0,
    "pepper rex": 0,
    serpents: 0,
    "magma sprites": 0,
  };

  // empty meaning no monsters have been killed
  if (json.SaveGame.player.stats.specificMonstersKilled === "")
    return {
      deepestMineLevel,
      deepestSkullCavernLevel,
      monstersKilled,
    };

  // if this is undefined then `item` is a list which means multiple monsters have been killed
  if (
    typeof json.SaveGame.player.stats.specificMonstersKilled.item.key ===
    "undefined"
  ) {
    // loop through all the monsters killed and tally their totals for the categories
    for (const idx in json.SaveGame.player.stats.specificMonstersKilled.item) {
      let monsterName =
        json.SaveGame.player.stats.specificMonstersKilled.item[idx].key.string;
      if (typeof categories[monsterName] === "undefined") continue;
      let amountKilled =
        json.SaveGame.player.stats.specificMonstersKilled.item[idx].value.int;

      monstersKilled[categories[monsterName]] += amountKilled;
    }
  } else {
    // only one monster has been killed
    let monsterName =
      json.SaveGame.player.stats.specificMonstersKilled.item.key.string;
    if (typeof categories[monsterName] === "undefined")
      return {
        deepestMineLevel,
        deepestSkullCavernLevel,
        monstersKilled,
      };
    let amountKilled =
      json.SaveGame.player.stats.specificMonstersKilled.item.value.int;

    monstersKilled[categories[monsterName]] += amountKilled;
  }

  /* We should do this on the frontend and just save the monster kills per category
  // now we'll iterate through the amounts and see which goals are still needed
  for (const entry in monstersKilled) {
    if (monstersKilled[entry as category] < goals[entry as category]) {
      let amtNeeded =
        goals[entry as category] - monstersKilled[entry as category];
      goalsNeeded.push(
        // loop through the monsters and return a list of the ones that are needed in this category
        `${entry}: ${amtNeeded} more kills are needed in this category. (${Object.keys(
          categories
        )
          .filter((key) => categories[key] == entry)
          .join(", ")})`
      );
    }
  }
  */

  return {
    deepestMineLevel,
    deepestSkullCavernLevel,
    monstersKilled,
  };
}
