interface CookingIngredient {
  itemID: number;
  quantity: number;
}

interface CookingRecipeInstructions {
  itemID: number;
  unlockConditions: string;
  ingredients: CookingIngredient[];
}

export type CookingRecipe = CookingRecipeInstructions;
