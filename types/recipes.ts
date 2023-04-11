import type cooking_recipes from "../research/processors/data/cooking_recipes.json";

export type CookingRecipe =
  (typeof cooking_recipes)[keyof typeof cooking_recipes];

import type crafting_recipes from "../research/processors/data/crafting_recipes.json";
export type CraftingRecipe =
  (typeof crafting_recipes)[keyof typeof crafting_recipes];
