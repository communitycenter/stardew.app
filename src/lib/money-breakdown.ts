import { itemValue } from "@/lib/net-worth";
import { weeklyContribution } from "@/lib/weekly-income";
import type { ItemRecord, ItemsRet } from "@/lib/parsers/items";

export interface BreakdownRow {
	name: string;
	count: number; // total units across all stacks
	location: string; // specific spot inside the region ("Cellar", "Big Shed", "Inventory")
	value: number; // contribution to net worth
	weekly: number; // contribution to estimated weekly income
}

export interface RegionBreakdown {
	region: string; // "The Farm", "Ginger Island", "The Valley", "On your person"
	value: number;
	weekly: number;
	rows: BreakdownRow[]; // sorted by value, largest first
}

const FARM_LOCATIONS = new Set([
	"Farm",
	"FarmHouse",
	"Greenhouse",
	"Cellar",
	"FarmCave",
]);

function regionOf(record: ItemRecord): string {
	const loc = record.location;
	if (loc === "player") return "On your person";
	if (loc.startsWith("Island") || loc === "Caldera" || loc === "CaptainRoom")
		return "Ginger Island";
	if (FARM_LOCATIONS.has(loc) || loc.startsWith("Farm > ")) return "The Farm";
	return "The Valley";
}

// "IslandNorthCave1" -> "Island North Cave 1"
function formatLocationName(name: string): string {
	return name
		.replace(/([a-z])([A-Z])/g, "$1 $2") // IslandWest -> Island West
		.replace(/([A-Za-z])(\d)/g, "$1 $2") // Cave1 -> Cave 1
		.replace(/(\d)([A-Za-z])/g, "$1 $2"); // 1Room -> 1 Room
}

function locationLabel(record: ItemRecord): string {
	if (record.location === "player") {
		return record.source === "equipment" ? "Equipped" : "Inventory";
	}
	if (record.location.startsWith("Farm > ")) {
		return formatLocationName(record.location.slice("Farm > ".length));
	}
	return formatLocationName(record.location);
}

// in-progress items get a suffix so they don't merge with stock in chests
function rowName(record: ItemRecord): string {
	switch (record.source) {
		case "crop":
			return `${record.name} (${
				record.readyForHarvest ? "ready to harvest" : "growing"
			})`;
		case "fruitTree":
			return `${record.name} (on tree)`;
		case "machine":
			return record.container
				? `${record.name} (in ${record.container.toLocaleLowerCase()})`
				: `${record.name} (processing)`;
		default:
			return record.name;
	}
}

/** Rows per item per spot, grouped by region. Zero-value, zero-income records are dropped. */
export function buildBreakdown(items: ItemsRet): RegionBreakdown[] {
	const regions = new Map<
		string,
		{ value: number; weekly: number; rows: Map<string, BreakdownRow> }
	>();

	for (const record of [...items.player, ...items.world]) {
		const value = itemValue(record);
		const weekly = weeklyContribution(record);
		if (value === 0 && weekly === 0) continue;

		const regionName = regionOf(record);
		let region = regions.get(regionName);
		if (!region) {
			region = { value: 0, weekly: 0, rows: new Map() };
			regions.set(regionName, region);
		}

		region.value += value;
		region.weekly += weekly;

		const location = locationLabel(record);
		const name = rowName(record);
		const key = `${name}|${location}`;
		const row = region.rows.get(key);
		if (row) {
			row.count += record.stack;
			row.value += value;
			row.weekly += weekly;
		} else {
			region.rows.set(key, {
				name,
				count: record.stack,
				location,
				value,
				weekly,
			});
		}
	}

	return Array.from(regions.entries())
		.map(([region, data]) => ({
			region,
			value: data.value,
			weekly: data.weekly,
			rows: Array.from(data.rows.values()).sort(
				(a, b) => b.value - a.value || b.weekly - a.weekly,
			),
		}))
		.sort((a, b) => b.value - a.value);
}
