interface CookingRecipeID {
  itemID: CookingRecipeInstructions;
}

interface CookingRecipeInstructions {
  name: string;
  itemID: number;
  iconURL: string;
  description: string;
  unlockConditions: string;
  ingredients: CookingIngredient[];
}

interface CookingIngredient {
  itemID: number;
  amount: number;
}

export type CookingRecipe = CookingRecipeInstructions;
