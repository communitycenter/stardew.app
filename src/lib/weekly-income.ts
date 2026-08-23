import machines from "@/data/machines.json";
import { itemValue } from "@/lib/net-worth";
import { cropData, farmAnimalData } from "@/lib/parsers/items";
import type { ItemRecord, ItemsRet } from "@/lib/parsers/items";
import objects from "@/data/objects.json";

// in-game minutes per day
const MINUTES_PER_DAY = 1600;
const DAYS_PER_WEEK = 7;

// days to iridium at agingRate 1 (wine)
const CASK_IRIDIUM_DAYS = 56;

// tappers and solar panels have no timed rules in Data/Machines
const TAPPER_IDS = new Set(["105", "264"]);
const HEAVY_TAPPER_ID = "264";
const TAPPER_DAYS: Record<string, number> = {
	"724": 9, // Maple Syrup
	"725": 7, // Oak Resin
	"726": 5, // Pine Tar
	"92": 1, // Sap (Mahogany)
	"MysticSyrup": 7,
};

const SOLAR_PANEL_ID = "231";
const SOLAR_PANEL_DAYS = 7; // one Battery Pack a week (in sunny weather)

interface MachineData {
	name: string;
	minutes: number | null; // typical processing time, null when untimed
	byOutput: Record<string, number>; // per-output processing time where rules differ
}

const machineData = machines as Record<string, MachineData>;
const objectData = objects as Record<string, { price?: number }>;

function weeklyRate(value: number, cycleDays: number): number {
	if (value <= 0 || cycleDays <= 0) return 0;
	return Math.floor(value * (DAYS_PER_WEEK / cycleDays));
}

// one harvest: minHarvest plus the expected extras from extraHarvestChance
function expectedHarvestValue(record: ItemRecord): number {
	const base = itemValue(record);
	const data = cropData[record.itemId];
	if (!data || base === 0) return base;

	const p = Math.min(0.9, data.extraHarvestChance);
	if (p <= 0) return base;
	const perItem = base / record.stack;
	return base + perItem * (p / (1 - p));
}

function cropWeeklyContribution(record: ItemRecord): number {
	const regrow = cropData[record.itemId]?.regrowDays ?? -1;
	const cycleDays = regrow > 0 ? regrow : (record.growthDays ?? 0);
	return weeklyRate(expectedHarvestValue(record), cycleDays);
}

function machineWeeklyContribution(record: ItemRecord): number {
	if (record.machineId === undefined) return 0;

	// casks: valued at iridium over the full aging time
	if (record.daysToMature !== undefined || record.agingRate !== undefined) {
		const rate =
			record.agingRate && record.agingRate > 0 ? record.agingRate : 1;
		const iridiumValue = itemValue({ ...record, quality: 4 });
		return weeklyRate(iridiumValue, CASK_IRIDIUM_DAYS / rate);
	}

	if (TAPPER_IDS.has(record.machineId)) {
		let days = TAPPER_DAYS[record.itemId] ?? 0;
		if (record.machineId === HEAVY_TAPPER_ID) days /= 2;
		return weeklyRate(itemValue(record), days);
	}

	if (record.machineId === SOLAR_PANEL_ID) {
		return weeklyRate(itemValue(record), SOLAR_PANEL_DAYS);
	}

	const machine = machineData[record.machineId];
	const minutes = machine?.byOutput[record.itemId] ?? machine?.minutes ?? null;
	if (minutes === null) return 0;
	return weeklyRate(itemValue(record), minutes / MINUTES_PER_DAY);
}

function animalWeeklyContribution(record: ItemRecord): number {
	if (!record.mature) return 0;
	const data = farmAnimalData[record.name];
	if (!data?.produceId) return 0;
	const price = objectData[data.produceId]?.price ?? 0;
	return weeklyRate(price, data.daysToProduce);
}

function fruitTreeWeeklyContribution(record: ItemRecord): number {
	if (!record.mature) return 0;
	return weeklyRate(itemValue({ ...record, stack: 1 }), 1);
}

/**
 * Long-run gold per week from one record: what it produces over a full cycle
 * from scratch. Current progress is ignored; stock (chests, shipping bin) is not income.
 */
export function weeklyContribution(record: ItemRecord): number {
	switch (record.source) {
		case "machine":
			return machineWeeklyContribution(record);
		case "crop":
			return cropWeeklyContribution(record);
		case "animal":
			return animalWeeklyContribution(record);
		case "fruitTree":
			return fruitTreeWeeklyContribution(record);
		default:
			return 0;
	}
}

/**
 * Long-run average gold per in-game week from everything currently producing.
 * Fish ponds not included.
 */
export function estimateWeeklyIncome(items: ItemsRet): number {
	let total = 0;
	for (const record of items.world) {
		total += weeklyContribution(record);
	}
	return total;
}
