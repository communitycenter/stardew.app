import crafting_recipes from "../../research/processors/data/crafting_recipes.json";

interface ReturnType {
  allRecipesCount: number;
  knownCount: number;
  craftedCount: number;
  uncraftedRecipes: Set<string>;
  unknownRecipes: Set<string>;
  allRecipes: { [key: string]: 0 | 1 | 2 }; // 1 = uncrafted, 2 = crafted
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
  const allRecipes_name: Record<string, string> = {};
  let allRecipes: { [key: string]: 0 | 1 | 2 } = {};
  for (const key in crafting_recipes) {
    let itemID = key;
    let itemName =
      crafting_recipes[key as keyof typeof crafting_recipes]["name"];

    allRecipes_name[itemName] = itemID;
    allRecipes[itemID] = 0; // initialize to unknown
  }
  // then, we'll find all the recipes that the player knows and also those they've crafted
  const knownRecipes = new Set<string>(); // a set of recipe IDs
  const craftedRecipes = new Set<string>(); // a set of recipe IDs
  //! new save files have multiple recipes by default so no checks needed
  for (const idx in json.SaveGame.player.craftingRecipes.item) {
    let recipe = json.SaveGame.player.craftingRecipes.item[idx];
    let recipeName = recipe.key.string;
    if (recipeName === "Oil Of Garlic") {
      recipeName = "Oil of Garlic"; // translation needed
    }
    let amountCrafted = recipe.value.int;

    // find the recipe ID since keys in craftingRecipes.item is the item name
    const itemID = allRecipes_name[recipeName];
    knownRecipes.add(itemID);
    allRecipes[itemID] = 1; // 1 = uncrafted but known recipe.
    if (amountCrafted > 0) {
      craftedRecipes.add(itemID);
      allRecipes[itemID] = 2; // 2 = crafted recipe.
    }
  }

  // now, we can find the recipes that the players hasn't crafted yet BUT knows
  const uncraftedRecipes = new Set<string>( // @ts-ignore
    [...knownRecipes].filter((id) => !craftedRecipes.has(id))
  );

  // and finally those crafting recipes that the player needs to learn
  const unknownRecipes = new Set<string>(
    Object.values(allRecipes_name).filter((id) => !knownRecipes.has(id))
  );

  return {
    allRecipesCount: Object.keys(allRecipes_name).length,
    knownCount: knownRecipes.size,
    craftedCount: craftedRecipes.size,
    uncraftedRecipes,
    unknownRecipes,
    allRecipes,
  };
}
