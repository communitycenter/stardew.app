import crops from "@/data/crops.json";
import farmAnimals from "@/data/farm_animals.json";
import fruitTrees from "@/data/fruit_trees.json";
import objects from "@/data/objects.json";
import { GetListOrEmpty, deweaponize } from "@/lib/utils";

const objectData = objects as Record<
	string,
	{ name: string; price?: number; category?: string }
>;

export interface CropData {
	name: string;
	seedId: string;
	growthDays: number;
	regrowDays: number; // -1 if destroyed on harvest
	minHarvest: number;
	maxHarvest: number;
	extraHarvestChance: number;
}

// keyed by harvest item ID
export const cropData = crops as Record<string, CropData>;

export interface FarmAnimalData {
	produceId: string | null;
	daysToProduce: number;
	daysToMature: number;
	sellPrice: number;
	house: string;
}

// keyed by animal type ("White Chicken")
export const farmAnimalData = farmAnimals as Record<string, FarmAnimalData>;

// keyed by tree ID (1.6 FruitTree.treeId)
const fruitTreeData = fruitTrees as Record<
	string,
	{ name: string; fruitId: string }
>;

/** Where an item was found in the save. */
export type ItemSourceType =
	| "inventory"
	| "equipment"
	| "chest"
	| "fridge"
	| "autoGrabber"
	| "machine" // product held by a machine
	| "buildingChest" // Mill / Junimo Hut
	| "fishPond"
	| "dresser"
	| "fishTank"
	| "crop" // growing in HoeDirt or a Garden Pot
	| "fruitTree"
	| "animal"
	| "shippingBin"
	| "placed"; // the placed object/furniture itself

export type EquipmentSlot =
	| "hat"
	| "boots"
	| "leftRing"
	| "rightRing"
	| "shirt"
	| "pants"
	| "trinket";

export interface ItemRecord {
	itemId: string; // unqualified ("613"); "" for 1.5 tools
	name: string;
	type: string; // xsi:type ("Object", "Cask", "Furniture", ...)
	stack: number;
	quality: number; // 0 normal, 1 silver, 2 gold, 4 iridium
	category?: number;
	basePrice?: number; // the save's <price>, not quality-adjusted
	bigCraftable?: boolean;
	source: ItemSourceType;
	location: string; // "Farm", "Farm > Shed", "player", ...
	container?: string; // "Chest", "Keg", pet name for animals, ...
	slot?: EquipmentSlot;
	// machine: casks use daysToMature/agingRate, everything else minutesUntilReady
	minutesUntilReady?: number;
	readyForHarvest?: boolean;
	daysToMature?: number;
	agingRate?: number;
	machineId?: string; // machine: which machine holds the product ("12" = Keg)
	growthDays?: number; // crop: planting to harvest, with fertilizer applied
	mature?: boolean; // fruitTree / animal: old enough to produce
}

export interface MoneyRet {
	current: number; // host wallet when wallets are shared
	totalEarned: number;
	useSeparateWallets: boolean;
}

export interface ItemsRet {
	money: MoneyRet;
	player: ItemRecord[]; // inventory + equipment
	world: ItemRecord[]; // shared across players
}

/** Context applied to every record a walker emits. */
interface ItemContext {
	source: ItemSourceType;
	location: string;
	container?: string;
	slot?: EquipmentSlot;
	defaultType?: string; // xsi:type fallback for tag-named elements (<hat>, ...)
}

// booleans sometimes parse as the strings "true"/"false"
function isTrue(value: any): boolean {
	return value === true || value === "true";
}

/** Raw save element -> ItemRecord; null for empty slots. */
function readItem(
	raw: any,
	prefix: string,
	ctx: ItemContext,
): ItemRecord | null {
	if (!raw || typeof raw !== "object") return null;
	if (raw.name === undefined || raw.name === null) return null;

	// 1.6: <itemId> (maybe qualified "(O)613"); 1.5: <parentSheetIndex>
	let itemId = "";
	if (raw.itemId !== undefined && raw.itemId !== null) {
		itemId = deweaponize(raw.itemId.toString()).value;
	} else if (raw.parentSheetIndex !== undefined) {
		itemId = raw.parentSheetIndex.toString();
	}

	const record: ItemRecord = {
		itemId,
		name: raw.name.toString(),
		type: raw[`@_${prefix}:type`]?.toString() ?? ctx.defaultType ?? "Object",
		stack: Number(raw.stack) || 1,
		quality: Number(raw.quality) || 0,
		source: ctx.source,
		location: ctx.location,
	};

	if (typeof raw.category === "number") record.category = raw.category;
	if (typeof raw.price === "number") record.basePrice = raw.price;
	if (isTrue(raw.bigCraftable)) record.bigCraftable = true;
	if (ctx.container) record.container = ctx.container;
	if (ctx.slot) record.slot = ctx.slot;

	return record;
}

function walkItemList(
	wrapper: any, // the element containing <Item> children (e.g. a chest's `items`)
	prefix: string,
	ctx: ItemContext,
): ItemRecord[] {
	const records: ItemRecord[] = [];
	for (const raw of GetListOrEmpty(wrapper, "Item")) {
		const record = readItem(raw, prefix, ctx);
		if (record) records.push(record);
	}
	return records;
}

function walkObject(obj: any, prefix: string, location: string): ItemRecord[] {
	if (!obj || typeof obj !== "object") return [];

	const records: ItemRecord[] = [];
	const type = obj[`@_${prefix}:type`]?.toString() ?? "Object";

	const placed = readItem(obj, prefix, { source: "placed", location });
	if (placed) records.push(placed);

	if (type === "IndoorPot") {
		const crop = readCrop(obj.hoeDirt?.crop, location, obj.name?.toString());
		if (crop) records.push(crop);
	} else if (type === "Chest") {
		records.push(
			...walkItemList(obj.items, prefix, {
				source: isTrue(obj.fridge) ? "fridge" : "chest",
				location,
				container: obj.name?.toString(),
			}),
		);
	} else if (obj.heldObject && typeof obj.heldObject === "object") {
		const heldType = obj.heldObject[`@_${prefix}:type`]?.toString();
		if (heldType === "Chest") {
			records.push(
				...walkItemList(obj.heldObject.items, prefix, {
					source: "autoGrabber",
					location,
					container: obj.name?.toString(),
				}),
			);
		} else {
			const held = readItem(obj.heldObject, prefix, {
				source: "machine",
				location,
				container: obj.name?.toString(),
			});
			if (held) {
				if (placed?.itemId) held.machineId = placed.itemId;
				if (typeof obj.minutesUntilReady === "number")
					held.minutesUntilReady = obj.minutesUntilReady;
				if (isTrue(obj.readyForHarvest)) held.readyForHarvest = true;
				if (typeof obj.daysToMature === "number")
					held.daysToMature = obj.daysToMature;
				if (typeof obj.agingRate === "number") held.agingRate = obj.agingRate;
				records.push(held);
			}
		}
	}

	return records;
}

function walkFurniture(
	furn: any,
	prefix: string,
	location: string,
): ItemRecord[] {
	if (!furn || typeof furn !== "object") return [];

	const records: ItemRecord[] = [];
	const type = furn[`@_${prefix}:type`]?.toString() ?? "Furniture";

	const placed = readItem(furn, prefix, {
		source: "placed",
		location,
		defaultType: "Furniture",
	});
	if (placed) records.push(placed);

	const heldCtx: ItemContext = {
		source: type === "FishTankFurniture" ? "fishTank" : "dresser",
		location,
		container: furn.name?.toString(),
	};

	// dressers wrap a list (heldItems.Item[]); fish tanks repeat <heldItems> per item
	for (const entry of GetListOrEmpty(furn, "heldItems")) {
		if (!entry || typeof entry !== "object") continue;
		if (entry.Item !== undefined) {
			records.push(...walkItemList(entry, prefix, heldCtx));
		} else {
			const record = readItem(entry, prefix, heldCtx);
			if (record) records.push(record);
		}
	}

	// item sitting on top (tables)
	if (furn.heldObject && typeof furn.heldObject === "object") {
		const held = readItem(furn.heldObject, prefix, {
			source: "placed",
			location,
			container: furn.name?.toString(),
		});
		if (held) records.push(held);
	}

	return records;
}

function walkBuilding(
	building: any,
	prefix: string,
	parentLocation: string,
): ItemRecord[] {
	if (!building || typeof building !== "object") return [];

	const records: ItemRecord[] = [];
	const type = building[`@_${prefix}:type`]?.toString();

	// sheds/barns/coops/cabins; FarmHouse and Greenhouse are top-level locations
	if (building.indoors && typeof building.indoors === "object") {
		const label = `${parentLocation} > ${building.buildingType?.toString() ?? "Building"
			}`;
		records.push(...walkLocation(building.indoors, prefix, label));
	}

	// 1.6 Mill / Junimo Hut chests
	for (const chest of GetListOrEmpty(building.buildingChests, "Chest")) {
		if (!chest || typeof chest !== "object") continue;
		records.push(
			...walkItemList(chest.items, prefix, {
				source: "buildingChest",
				location: parentLocation,
				container: chest.name?.toString(),
			}),
		);
	}

	// 1.5 equivalent
	for (const key of ["input", "output"]) {
		const chest = building[key];
		if (chest && typeof chest === "object" && chest.items !== undefined) {
			records.push(
				...walkItemList(chest.items, prefix, {
					source: "buildingChest",
					location: parentLocation,
					container: key,
				}),
			);
		}
	}

	if (type === "FishPond" && building.output) {
		const output = readItem(building.output.Item, prefix, {
			source: "fishPond",
			location: parentLocation,
			container: "Fish Pond",
		});
		if (output) records.push(output);
	}

	return records;
}

// 1.6 forage crops have no harvest item, only whichForageCrop
const FORAGE_CROP_HARVEST: Record<string, string> = {
	"1": "399", // Spring Onion
	"2": "829", // Ginger
};

/** A live crop, as minHarvest of its harvest item at normal quality. */
function readCrop(
	crop: any,
	location: string,
	container?: string,
): ItemRecord | null {
	if (!crop || typeof crop !== "object") return null;
	if (isTrue(crop.dead)) return null;

	let harvestId = "";
	if (crop.indexOfHarvest !== undefined && crop.indexOfHarvest !== null) {
		harvestId = deweaponize(crop.indexOfHarvest.toString()).value;
	}
	if ((!harvestId || harvestId === "-1") && isTrue(crop.forageCrop)) {
		harvestId = FORAGE_CROP_HARVEST[crop.whichForageCrop?.toString()] ?? "";
	}
	if (!harvestId || harvestId === "-1") return null;

	const data = objectData[harvestId];
	const growth = cropData[harvestId];

	// the last phase is a 99999 sentinel
	const phaseDays = GetListOrEmpty(crop.phaseDays, "int")
		.map(Number)
		.filter((d) => Number.isFinite(d) && d < 99999);
	const currentPhase = Number(crop.currentPhase) || 0;
	const dayOfCurrentPhase = Number(crop.dayOfCurrentPhase) || 0;
	const fullyGrown = isTrue(crop.fullyGrown);

	// per Crop.cs; regrowing crops count dayOfCurrentPhase down to the next harvest
	const inFinalPhase = currentPhase >= phaseDays.length;
	const ready = inFinalPhase && (!fullyGrown || dayOfCurrentPhase <= 0);

	const growthDays = phaseDays.reduce((sum, d) => sum + d, 0);

	const record: ItemRecord = {
		itemId: harvestId,
		name: data?.name ?? `Crop ${harvestId}`,
		type: "Crop",
		stack: Math.max(1, growth?.minHarvest ?? 1),
		quality: 0,
		source: "crop",
		location,
		growthDays,
	};
	if (typeof data?.price === "number") record.basePrice = data.price;
	if (ready) record.readyForHarvest = true;
	if (container) record.container = container;
	return record;
}

/** A fruit tree: stack = fruit on it, mature = producing. Quality follows tree age. */
function readFruitTree(
	tree: any,
	prefix: string,
	location: string,
): ItemRecord | null {
	const age = Number(tree.daysUntilMature) || 0;
	let quality = 0;
	if (age <= -336) quality = 4;
	else if (age <= -224) quality = 2;
	else if (age <= -112) quality = 1;

	// 1.6 repeats <fruit> once per fruit held; 1.5 used indexOfFruit + fruitsOnTree
	const fruitItems = GetListOrEmpty(tree, "fruit").filter(
		(item) => item && typeof item === "object" && item.name !== undefined,
	);
	let fruitId = "";
	let count = 0;
	if (fruitItems.length > 0) {
		count = fruitItems.reduce(
			(sum, item) => sum + (Number(item.stack) || 1),
			0,
		);
		if (fruitItems[0].itemId !== undefined && fruitItems[0].itemId !== null) {
			fruitId = deweaponize(fruitItems[0].itemId.toString()).value;
		}
	} else if (typeof tree.indexOfFruit === "number") {
		fruitId = tree.indexOfFruit.toString();
		count = Number(tree.fruitsOnTree) || 0;
	}
	// a bare tree still needs its species for the income estimate
	if (!fruitId && tree.treeId !== undefined && tree.treeId !== null) {
		fruitId = fruitTreeData[tree.treeId.toString()]?.fruitId ?? "";
	}
	if (!fruitId) return null;

	const data = objectData[fruitId];
	const record: ItemRecord = {
		itemId: fruitId,
		name: data?.name ?? `Fruit ${fruitId}`,
		type: "Object",
		stack: count,
		quality,
		source: "fruitTree",
		location,
		container: "Fruit Tree",
	};
	if (typeof data?.price === "number") record.basePrice = data.price;
	if (age <= 0) record.mature = true;
	return record;
}

function walkTerrainFeatures(
	loc: any,
	prefix: string,
	location: string,
): ItemRecord[] {
	const records: ItemRecord[] = [];

	for (const entry of GetListOrEmpty(loc.terrainFeatures, "item")) {
		const feature = entry?.value?.TerrainFeature;
		if (!feature || typeof feature !== "object") continue;
		const type = feature[`@_${prefix}:type`]?.toString();

		if (type === "HoeDirt") {
			const crop = readCrop(feature.crop, location);
			if (crop) records.push(crop);
		} else if (type === "FruitTree") {
			const tree = readFruitTree(feature, prefix, location);
			if (tree) records.push(tree);
		}
	}

	return records;
}

/** Animals, valued per FarmAnimal.getSellPrice. */
function walkAnimals(loc: any, location: string): ItemRecord[] {
	const records: ItemRecord[] = [];

	for (const entry of GetListOrEmpty(loc.animals, "item")) {
		const animal = entry?.value?.FarmAnimal;
		if (!animal || typeof animal !== "object") continue;

		const species = animal.type?.toString() ?? "Animal";
		// 1.6 doesn't serialise <price>; fall back to the species' base value
		const price =
			Number(animal.price) || farmAnimalData[species]?.sellPrice || 0;
		const friendship = Number(animal.friendshipTowardFarmer) || 0;
		const sellPrice = Math.floor(price * (friendship / 1000 + 0.3));
		const age = Number(animal.age) || 0;
		const daysToMature = farmAnimalData[species]?.daysToMature ?? 0;

		const record: ItemRecord = {
			itemId: "",
			name: species,
			type: "FarmAnimal",
			stack: 1,
			quality: 0,
			source: "animal",
			location,
		};
		if (sellPrice > 0) record.basePrice = sellPrice;
		if (age >= daysToMature) record.mature = true;
		if (animal.name !== undefined && animal.name !== null)
			record.container = animal.name.toString();
		records.push(record);
	}

	return records;
}

function walkLocation(loc: any, prefix: string, label: string): ItemRecord[] {
	if (!loc || typeof loc !== "object") return [];

	const records: ItemRecord[] = [];

	for (const entry of GetListOrEmpty(loc.objects, "item")) {
		records.push(...walkObject(entry?.value?.Object, prefix, label));
	}

	for (const furn of GetListOrEmpty(loc.furniture, "Furniture")) {
		records.push(...walkFurniture(furn, prefix, label));
	}

	// kitchen fridge
	if (loc.fridge && typeof loc.fridge === "object") {
		records.push(
			...walkItemList(loc.fridge.items, prefix, {
				source: "fridge",
				location: label,
				container: "Fridge",
			}),
		);
	}

	records.push(...walkTerrainFeatures(loc, prefix, label));
	records.push(...walkAnimals(loc, label));

	if (loc.shippingBin && typeof loc.shippingBin === "object") {
		records.push(
			...walkItemList(loc.shippingBin, prefix, {
				source: "shippingBin",
				location: label,
				container: "Shipping Bin",
			}),
		);
	}

	for (const building of GetListOrEmpty(loc.buildings, "Building")) {
		records.push(...walkBuilding(building, prefix, label));
	}

	return records;
}

function walkPlayer(player: any, prefix: string): ItemRecord[] {
	const records: ItemRecord[] = [];

	records.push(
		...walkItemList(player.items, prefix, {
			source: "inventory",
			location: "player",
		}),
	);

	// equipment elements carry no xsi:type, so each slot supplies a default
	const equipment: [string, EquipmentSlot, string][] = [
		["hat", "hat", "Hat"],
		["boots", "boots", "Boots"],
		["leftRing", "leftRing", "Ring"],
		["rightRing", "rightRing", "Ring"],
		["shirtItem", "shirt", "Clothing"],
		["pantsItem", "pants", "Clothing"],
		["trinketItem", "trinket", "Trinket"], // 1.6 only
	];
	for (const [key, slot, defaultType] of equipment) {
		const record = readItem(player[key], prefix, {
			source: "equipment",
			location: "player",
			slot,
			defaultType,
		});
		if (record) records.push(record);
	}

	return records;
}

function parseMoney(player: any, hostPlayer: any): MoneyRet {
	// only the host has useSeparateWallets; farmhands only have <money> when separate
	return {
		current: Number(player.money ?? hostPlayer.money ?? 0),
		totalEarned: Number(player.totalMoneyEarned ?? 0),
		useSeparateWallets: isTrue(hostPlayer.useSeparateWallets),
	};
}

/** Every item in the world. Run once per save and shared across players. */
export function parseWorldItems(prefix: string, SaveGame: any): ItemRecord[] {
	try {
		const records: ItemRecord[] = [];

		for (const loc of GetListOrEmpty(SaveGame.locations, "GameLocation")) {
			if (!loc || typeof loc !== "object") continue;
			const label =
				loc.name?.toString() ??
				loc[`@_${prefix}:type`]?.toString() ??
				"Unknown";
			records.push(...walkLocation(loc, prefix, label));
		}

		return records;
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error in parseWorldItems: ${err.message}`);
		throw new Error(`Error in parseWorldItems: ${err}`);
	}
}

/** One farmer's money, inventory and equipment plus the shared world items. */
export function parseItems(
	player: any,
	worldItems: ItemRecord[],
	hostPlayer: any,
	prefix: string,
): ItemsRet {
	try {
		return {
			money: parseMoney(player, hostPlayer),
			player: walkPlayer(player, prefix),
			world: worldItems,
		};
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error in parseItems: ${err.message}`);
		throw new Error(`Error in parseItems: ${err}`);
	}
}
