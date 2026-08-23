import type { ItemRecord, ItemSourceType, ItemsRet } from "@/lib/parsers/items";

// per Object.sellToStorePrice
const QUALITY_MULTIPLIERS: Record<number, number> = {
	0: 1, // normal
	1: 1.25, // silver
	2: 1.5, // gold
	4: 2, // iridium
};

export interface NetWorthBreakdown {
	total: number; // wallet + itemsValue
	wallet: number;
	itemsValue: number;
	bySource: Partial<Record<ItemSourceType, number>>;
	pricedCount: number; // item records that contributed value
	unpricedCount: number; // records that are unsellable or have no price
}

// Object subclasses that are ordinary items once picked up. Everything else —
// big craftables, furniture, wallpaper, equipment, tools, weapons — can't go in
// the shipping bin (see Object.canBeShipped) and doesn't count towards net worth.
const SELLABLE_TYPES = new Set([
	"Object",
	"ColoredObject",
	"Fence",
	"Torch",
	"CrabPot",
]);

/** Whether a record can be sold at all, regardless of its price. */
export function isSellable(item: ItemRecord): boolean {
	if (item.bigCraftable) return false;
	switch (item.source) {
		case "crop": // harvests are ordinary objects
		case "fruitTree":
		case "animal": // sold to Marnie
			return true;
		default:
			return SELLABLE_TYPES.has(item.type);
	}
}

export function itemValue(item: ItemRecord): number {
	if (!isSellable(item)) return 0;
	if (typeof item.basePrice !== "number" || item.basePrice <= 0) return 0;
	const multiplier = QUALITY_MULTIPLIERS[item.quality] ?? 1;
	return Math.floor(item.basePrice * multiplier) * item.stack;
}

/** Wallet plus the sell value of every item found anywhere. */
export function calculateNetWorth(items: ItemsRet): NetWorthBreakdown {
	const bySource: Partial<Record<ItemSourceType, number>> = {};
	let itemsValue = 0;
	let pricedCount = 0;
	let unpricedCount = 0;

	for (const record of [...items.player, ...items.world]) {
		const value = itemValue(record);
		if (value > 0) {
			itemsValue += value;
			bySource[record.source] = (bySource[record.source] ?? 0) + value;
			pricedCount++;
		} else {
			unpricedCount++;
		}
	}

	return {
		total: items.money.current + itemsValue,
		wallet: items.money.current,
		itemsValue,
		bySource,
		pricedCount,
		unpricedCount,
	};
}
