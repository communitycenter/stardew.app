interface Ingredient {
  itemID: number;
  quantity: number;
}

export interface Recipe {
  itemID: number;
  unlockConditions: string;
  ingredients: Ingredient[];
}

export interface CraftingRecipe extends Recipe {
  isBigCraftable: boolean;
}
