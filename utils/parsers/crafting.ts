import crafting_recipes from "../../research/processors/data/crafting_recipes.json";

interface ReturnType {
  allRecipesCount: number;
  knownRecipesCount: number;
  craftedRecipesCount: number;
  uncraftedRecipes: Set<string>;
  unknownRecipes: Set<string>;
}

export function parseCrafting(json: any): ReturnType {
  /*
    Achievements Relevant:
      - D.I.Y. (craft 15 different items).
      - Artisan (craft 30 different items).
      - Craft Master (craft every item).
  */

  // first, we need to make a list of all the crafting recipes in the game
  // this will help us map the names to IDs
  const allRecipes: Record<string, string> = {};
  for (const key in crafting_recipes) {
    let itemID = key;
    let itemName =
      crafting_recipes[key as keyof typeof crafting_recipes]["name"];

    allRecipes[itemName] = itemID;
  }
  // then, we'll find all the recipes that the player knows and also those they've crafted
  const knownRecipes = new Set<string>(); // a set of recipe IDs
  const craftedRecipes = new Set<string>(); // a set of recipe IDs
  // new save files have multiple recipes by default so no checks needed
  for (const idx in json.SaveGame.player.craftingRecipes.item) {
    let recipe = json.SaveGame.player.craftingRecipes.item[idx];
    let recipeName = recipe.key.string;
    if (recipeName === "Oil Of Garlic") {
      recipeName = "Oil of Garlic"; // translation needed
    }
    let amountCrafted = recipe.value.int;

    // find the recipe ID since keys in craftingRecipes.item is the item name
    const itemID = allRecipes[recipeName];
    knownRecipes.add(itemID);
    if (amountCrafted > 0) {
      craftedRecipes.add(itemID);
    }
  }

  // now, we can find the recipes that the players hasn't crafted yet BUT knows
  const uncraftedRecipes = new Set<string>( // @ts-ignore
    [...knownRecipes].filter((id) => !craftedRecipes.has(id))
  );

  // and finally those crafting recipes that the player needs to learn
  const unknownRecipes = new Set<string>(
    Object.values(allRecipes).filter((id) => !knownRecipes.has(id))
  );

  return {
    allRecipesCount: Object.keys(allRecipes).length,
    knownRecipesCount: knownRecipes.size,
    craftedRecipesCount: craftedRecipes.size,
    uncraftedRecipes,
    unknownRecipes,
  };
}
