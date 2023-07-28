import objects from "@/data/objects.json";
import craftingRecipes from "@/data/crafting.json";
import bigCraftables from "@/data/big_craftables.json";

export interface CraftingRet {
  knownCount: number;
  craftedCount: number;
  recipes: { [key: string]: 0 | 1 | 2 };
}

export function parseCrafting(player: any): CraftingRet {
  /*
    Achievements Relevant:
      - D.I.Y. (craft 15 different items).
      - Artisan (craft 30 different items).
      - Craft Master (craft every item).
  */

  try {
    let knownRecipes = new Set<string>();
    let craftedRecipes = new Set<string>();

    // 0 = unknown, 1 = known, 2 = crafted
    // 0 might be unused, we can just check if key exists
    let recipes: { [key: string]: 0 | 1 | 2 } = {};

    if (
      !player.craftingRecipes ||
      typeof player.craftingRecipes === "undefined"
    ) {
      return {
        knownCount: 0,
        craftedCount: 0,
        recipes,
      };
    }

    const translations = {
      "Transmute (Fe)": "Iron Bar",
      "Transmute (Au)": "Gold Bar",
      "Wild Seeds (Sp)": "Spring Seeds",
      "Wild Seeds (Su)": "Summer Seeds",
      "Wild Seeds (Fa)": "Fall Seeds",
      "Wild Seeds (Wi)": "Winter Seeds",
      "Oil Of Garlic": "Oil of Garlic",
    };

    // copy from console output of processors/crafting.py
    // we need to look up the itemID for the recipes so we'll create a map
    let name_to_id: Map<string, string> = new Map();
    for (const key in craftingRecipes) {
      // since we minimized our crafting.json file, we don't have the names
      let name = "";
      if (craftingRecipes[key as keyof typeof craftingRecipes].isBigCraftable) {
        name = bigCraftables[key as keyof typeof bigCraftables].name;
      } else {
        name = objects[key as keyof typeof objects].name;
      }

      if (!name) throw new Error(`No name for ${key}`);
      name_to_id.set(name, key);
    }

    // craftingRecipes.item.key.string is the name of the recipe (needs translation)
    // craftingRecipes.item.value is the number of times the recipe has been crafted

    if (Array.isArray(player.craftingRecipes.item)) {
      // multiple recipes that the player knows
      for (const idx in player.craftingRecipes.item) {
        let recipe = player.craftingRecipes.item[idx];
        let name = recipe.key.string;
        let count = recipe.value.int;

        if (name in translations) {
          name = translations[name as keyof typeof translations];
        }

        let itemID = name_to_id.get(name);

        // make sure its a valid recipe
        if (itemID && itemID in craftingRecipes) {
          knownRecipes.add(itemID);
          recipes[itemID] = 1;

          // check if the player has crafted this recipe
          if (count > 0) {
            craftedRecipes.add(itemID);
            recipes[itemID] = 2;
          }
        }
      }
    } else {
      // only one recipe that the player knows
      let recipe = player.craftingRecipes.item;
      let name = recipe.key.string;
      let count = recipe.value.int;

      if (name in translations) {
        name = translations[name as keyof typeof translations];
      }

      let itemID = name_to_id.get(name);
      if (itemID && itemID in craftingRecipes) {
        knownRecipes.add(itemID);
        recipes[itemID] = 1;

        // check if the player has crafted this recipe
        if (count > 0) {
          craftedRecipes.add(itemID);
          recipes[itemID] = 2;
        }
      }
    }

    return {
      knownCount: knownRecipes.size,
      craftedCount: craftedRecipes.size,
      recipes,
    };
  } catch (e) {
    let msg = "";
    if (e instanceof Error) {
      msg = e.message;
    }
    throw new Error(`Error in parseCrafting(): ${msg}`);
  }
}
