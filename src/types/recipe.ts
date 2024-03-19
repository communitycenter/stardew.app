interface Ingredient {
  itemID: string;
  quantity: number;
}

export interface Recipe {
  ingredients: Ingredient[];
  itemID: string;
  minVersion: string;
  unlockConditions: string;
}

export interface CraftingRecipe extends Recipe {
  isBigCraftable: boolean;
}
