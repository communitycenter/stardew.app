import cooking_recipes from "../../research/processors/data/cooking_recipes.json";

interface ReturnType {
  allRecipesCount: number;
  knownCount: number;
  cookedCount: number;
  uncookedRecipes: Set<recipeID>;
  unknownRecipes: Set<recipeID>;
  allRecipes: { [key: recipeID]: 0 | 1 | 2 }; // 1 = cooked, 2 = uncooked
}

// aliases for readibility
type recipeID = string;
type recipeName = string;

// some of the names are slightly different so we have to translate them
const translation = {
  Cookies: "Cookie",
  "Vegetable Stew": "Vegetable Medley",
  "Cran. Sauce": "Cranberry Sauce",
  "Cheese Cauli.": "Cheese Cauliflower",
  "Dish o' The Sea": "Dish O' The Sea",
  "Eggplant Parm.": "Eggplant Parmesan",
};

export function parseCooking(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Cook (cook 10 different recipes).
      - Sous Chef (cook 25 different recipes).
      - Gourmet Chef (cook every recipe).
  */

  // first, we need to make a list of all the recipes in the game
  // allRecipes_id will be a k,v pair of recipe id and recipe name
  // allRecipes_name will be a k,v pair of recipe name and recipe id
  let allRecipes_id: Record<recipeID, recipeName> = {};
  let allRecipes_name: Record<recipeName, recipeID> = {};
  let allRecipes: { [key: recipeID]: 0 | 1 | 2 } = {};
  for (const key in cooking_recipes) {
    allRecipes_id[key as recipeID] = cooking_recipes[
      key as keyof typeof cooking_recipes
    ]["name"] as recipeName;

    allRecipes_name[
      cooking_recipes[key as keyof typeof cooking_recipes]["name"] as recipeName
    ] = key as recipeID;

    allRecipes[key as recipeID] = 0;
  }

  // then, we'll find all the recipes that the player knows
  let knownRecipes = new Set<recipeID>(); // a set of recipe IDs
  // check if there are multiple recipes
  if (typeof json.SaveGame.player.cookingRecipes.item.key === "undefined") {
    // if there are multiple recipes, we need to loop through them
    for (const idx in json.SaveGame.player.cookingRecipes.item) {
      let recipe = json.SaveGame.player.cookingRecipes.item[idx];
      let recipeName = recipe.key.string;

      if (translation.hasOwnProperty(recipeName)) {
        recipeName = translation[recipeName as keyof typeof translation];
      }
      // find the recipe ID since keys in cookingRecipes is the item name
      let itemID: recipeID = allRecipes_name[recipeName];
      knownRecipes.add(itemID);
      allRecipes[itemID] = 1;
    }
  } else {
    // only one recipe known
    let recipeName = json.SaveGame.player.cookingRecipes.item.key.string;
    if (translation.hasOwnProperty(recipeName)) {
      recipeName = translation[recipeName as keyof typeof translation];
    }
    let itemID: recipeID = allRecipes_name[recipeName];
    knownRecipes.add(itemID);
    allRecipes[itemID] = 1;
  }

  if (json.SaveGame.player.recipesCooked === "") {
    // no recipes have been cooked
    return {
      allRecipesCount: Object.keys(allRecipes_id).length,
      knownCount: knownRecipes.size,
      cookedCount: 0,
      uncookedRecipes: knownRecipes,
      unknownRecipes: new Set<recipeID>(
        Object.keys(allRecipes_id).filter((id) => !knownRecipes.has(id))
      ),
      allRecipes,
    };
  }

  // next, we'll find the recipes the player has cooked
  let cookedRecipes = new Set<recipeID>();
  // check if there are multiple recipes cooked
  if (typeof json.SaveGame.player.recipesCooked.item.key === "undefined") {
    for (const idx in json.SaveGame.player.recipesCooked.item) {
      let recipe = json.SaveGame.player.recipesCooked.item[idx];
      cookedRecipes.add(recipe.key.int.toString() as recipeID);
      allRecipes[recipe.key.int.toString() as recipeID] = 2;
    }
  } else {
    // only one recipe cooked
    cookedRecipes.add(
      json.SaveGame.player.recipesCooked.item.key.int as recipeID
    );
    allRecipes[json.SaveGame.player.recipesCooked.item.key.int as recipeID] = 2;
  }

  // then, we'll find the recipes the player has not cooked by finding the
  // difference between knownRecipes and cookedRecipes
  let uncookedRecipes = new Set<recipeID>( // @ts-ignore
    [...knownRecipes].filter((id) => !cookedRecipes.has(id))
  );

  // finally, we can find the recipes that the player doesn't know by taking
  // the difference of allRecipes_id and knownRecipes
  let unknownRecipes = new Set<recipeID>(
    Object.keys(allRecipes_id).filter((id) => !knownRecipes.has(id))
  );

  let knownCount = knownRecipes.size;
  let cookedCount = cookedRecipes.size;
  let allRecipesCount = Object.keys(allRecipes_id).length;

  return {
    allRecipesCount,
    knownCount,
    cookedCount,
    uncookedRecipes,
    unknownRecipes,
    allRecipes,
  };
}
