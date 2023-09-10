import cookingRecipes from "@/data/cooking.json";
import objects from "@/data/objects.json";

export interface CookingRet {
  recipes: { [key: string]: 0 | 1 | 2 };
}

export function parseCooking(player: any): CookingRet {
  /*
    Achievements Relevant:
      - Cook (cook 10 different recipes).
      - Sous Chef (cook 25 different recipes).
      - Gourmet Chef (cook every recipe).
  */

  try {
    let knownRecipes = new Set<string>();
    let cookedRecipes = new Set<string>();
    // 0 = unknown, 1 = known, 2 = cooked
    // 0 might be unused, we can just check if key exists
    let recipes: { [key: string]: 0 | 1 | 2 } = {};

    if (
      !player.cookingRecipes ||
      typeof player.cookingRecipes === "undefined"
    ) {
      return {
        recipes,
      };
    }

    // copy from console output of processors/cooking.py
    // item keys from cookingRecipes may not be the same as the name from objects
    const translations = {
      "Cheese Cauli.": "Cheese Cauliflower",
      "Vegetable Stew": "Vegetable Medley",
      Cookies: "Cookie",
      "Eggplant Parm.": "Eggplant Parmesan",
      "Cran. Sauce": "Cranberry Sauce",
      "Dish o' The Sea": "Dish O' The Sea",
    };

    // the item.key.string is the name of the recipe
    // we need to look up the itemID for the recipes so we'll create a map
    let name_to_id: Map<string, string> = new Map();
    for (const key in cookingRecipes) {
      // since we minimized our cooking.json file, we don't have the names
      let name = objects[key as keyof typeof objects].name;
      name_to_id.set(name, key);
    }

    // cookingRecipes is just a list of recipes that the player knows
    if (Array.isArray(player.cookingRecipes.item)) {
      // multiple recipes that the player knows
      for (const idx in player.cookingRecipes.item) {
        let recipe = player.cookingRecipes.item[idx];
        let recipeName = recipe.key.string;

        // check if we have a translation for the recipe name
        if (recipeName in translations) {
          recipeName = translations[recipeName as keyof typeof translations];
        }

        // we need to look up the itemID for the recipe
        let itemID = name_to_id.get(recipeName);
        // and make sure it's a valid recipe
        if (itemID && itemID in cookingRecipes) {
          knownRecipes.add(itemID);
          recipes[itemID] = 1;
        }
      }
    } else {
      // only one recipe that the player knows
      let recipeName = player.cookingRecipes.item.key.string;

      if (recipeName in translations) {
        recipeName = translations[recipeName as keyof typeof translations];
      }

      let itemID = name_to_id.get(recipeName);
      if (itemID && itemID in cookingRecipes) {
        knownRecipes.add(itemID);
        recipes[itemID] = 1;
      }
    }

    // recipesCooked is a list of recipes that the player has cooked
    // item.key is the itemID (not name) for some reason, item.value is the number of times cooked
    if (Array.isArray(player.recipesCooked.item)) {
      // multiple recipes that the player has cooked
      for (const idx in player.recipesCooked.item) {
        let recipe = player.recipesCooked.item[idx];
        let recipeID = recipe.key.int.toString();

        // make sure it's a valid recipe
        if (!(recipeID in cookingRecipes)) continue;

        let recipeName = objects[recipeID as keyof typeof objects].name;

        // we need to look up the itemID for the recipe
        let itemID = name_to_id.get(recipeName);

        if (itemID) {
          cookedRecipes.add(itemID);
          recipes[itemID] = 2;
        }
      }
    } else if (player.recipesCooked.item) {
      // only one recipe that the player has cooked
      let recipeID = player.recipesCooked.item.key.int.toString();

      if (recipeID in cookingRecipes) {
        cookedRecipes.add(recipeID);
        recipes[recipeID] = 2;
      }
    }

    return {
      recipes,
    };
  } catch (e) {
    let msg = "";
    if (e instanceof Error) {
      msg = e.message;
    }
    throw new Error(`Error in parseCooking(): ${msg}`);
  }
}
