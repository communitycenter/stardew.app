import type cooking_recipes from "../research/processors/data/cooking_recipes.json";

export type CookingRecipe =
  typeof cooking_recipes[keyof typeof cooking_recipes];
