import cooking from "@/data/cooking.json";
import crafting from "@/data/crafting.json";

/**
 * Counts of recipe ingredients the player owns, keyed by ingredient ID
 * (the same IDs used in cooking.json / crafting.json, including the
 * category IDs "-4", "-5", "-6" and "-777").
 */
export type InventoryRet = Record<string, number>;

// Item types (the xsi:type / p3:type attribute) that can be recipe
// ingredients. Weapons, tools, rings, etc. reuse numeric IDs that collide with
// object IDs (e.g. weapon "16" vs Wild Horseradish "16"), so they're skipped.
const COUNTABLE_TYPES = new Set(["Object", "ColoredObject", "Torch"]);

// Category IDs used by recipes ("Any Fish", "Any Egg", "Any Milk").
const CATEGORY_INGREDIENTS = new Set(["-4", "-5", "-6"]);

// "Wild Seeds (Any)": Spring, Summer, Fall and Winter Seeds.
const WILD_SEEDS = new Set(["495", "496", "497", "498"]);

// Hard caps so a hand-edited or malicious save can't blow up the stored
// player object or the parser.
const MAX_STACK = 1_000_000;
const MAX_DEPTH = 64;

let ingredientIDs: Set<string> | null = null;

function getIngredientIDs(): Set<string> {
	if (ingredientIDs) return ingredientIDs;

	ingredientIDs = new Set<string>();
	for (const recipes of [cooking, crafting]) {
		for (const recipe of Object.values(recipes)) {
			for (const ingredient of recipe.ingredients) {
				ingredientIDs.add(ingredient.itemID);
			}
		}
	}

	return ingredientIDs;
}

function asList(value: any): any[] {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
}

function toInt(value: any): number | null {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isInteger(n) ? n : null;
}

/**
 * Adds a single save-file Item to the running counts if it is a recipe
 * ingredient (or belongs to an ingredient category).
 */
function countItem(item: any, prefix: string, counts: InventoryRet) {
	if (!item || typeof item !== "object") return;
	if (!COUNTABLE_TYPES.has(item[`@_${prefix}:type`])) return;

	const stack = toInt(item.stack);
	if (stack === null || stack <= 0) return;
	const amount = Math.min(stack, MAX_STACK);

	// 1.6 saves use itemId, 1.5 saves only have parentSheetIndex
	const rawID = item.itemId ?? item.parentSheetIndex;
	if (rawID === undefined || rawID === null) return;
	const id = String(rawID);
	const key = item.bigCraftable === true ? `(BC)${id}` : id;

	const ingredients = getIngredientIDs();
	const add = (k: string) => {
		counts[k] = Math.min((counts[k] ?? 0) + amount, MAX_STACK);
	};

	if (ingredients.has(key)) add(key);

	const category = toInt(item.category);
	if (category !== null && CATEGORY_INGREDIENTS.has(String(category))) {
		add(String(category));
	}

	if (WILD_SEEDS.has(key)) add("-777");
}

/**
 * Walks a parsed save-file subtree and counts the contents of every `items`
 * list in it (chests, fridges, mini-fridges, building interiors, hoppers,
 * auto-grabbers, ...).
 */
function countContainers(
	node: any,
	prefix: string,
	counts: InventoryRet,
	depth = 0,
) {
	if (!node || typeof node !== "object" || depth > MAX_DEPTH) return;

	if (Array.isArray(node)) {
		for (const child of node) countContainers(child, prefix, counts, depth + 1);
		return;
	}

	for (const [key, value] of Object.entries(node)) {
		if (key.startsWith("@_")) continue;

		if (key === "items" && value && typeof value === "object") {
			for (const item of asList((value as any).Item)) {
				countItem(item, prefix, counts);
			}
		}

		if (value && typeof value === "object") {
			countContainers(value, prefix, counts, depth + 1);
		}
	}
}

/**
 * Counts the items in storage that every player on the farm can reach:
 * chests, fridges and other containers in every location, plus global
 * inventories (Junimo Chests). Compute this once per save.
 */
export function parseSharedInventory(
	saveGame: any,
	prefix: string,
): InventoryRet {
	const counts: InventoryRet = {};

	try {
		countContainers(saveGame?.locations, prefix, counts);
		countContainers(saveGame?.globalInventories, prefix, counts);
	} catch (e) {
		if (process.env.NODE_ENV === "development") console.log(e);
	}

	return counts;
}

/**
 * Combines the shared storage counts with what one player is carrying.
 */
export function parseInventory(
	player: any,
	shared: InventoryRet,
	prefix: string,
): InventoryRet {
	const counts: InventoryRet = { ...shared };

	try {
		for (const item of asList(player?.items?.Item)) {
			countItem(item, prefix, counts);
		}
	} catch (e) {
		if (process.env.NODE_ENV === "development") console.log(e);
	}

	return counts;
}
