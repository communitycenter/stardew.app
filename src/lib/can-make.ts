import type { InventoryRet } from "@/lib/parsers/inventory";
import type { Recipe } from "@/types/recipe";

/**
 * Whether the player owns every ingredient a recipe needs right now.
 *
 * Each recipe is checked on its own, so two recipes that both need the last
 * of an ingredient will both show as makeable. Category ingredients ("Any
 * Fish", "Any Egg", ...) use the category totals from the inventory parser,
 * which can overlap with a specific fish or egg the same recipe also asks for.
 */
export function canMakeRecipe(
	recipe: Recipe,
	inventory: InventoryRet | undefined,
): boolean {
	if (!inventory) return false;

	return recipe.ingredients.every(
		(ingredient) => (inventory[ingredient.itemID] ?? 0) >= ingredient.quantity,
	);
}
