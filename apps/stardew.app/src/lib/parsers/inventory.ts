export interface InventoryItem {
	name: string;
	type: string;
	quality: number;
	stack: number;
	index: number;
	category: number;
	parentSheetIndex: number;
}

export interface InventoryContainer {
	type: string;
	location: string;
	items: InventoryItem[];
}

export interface InventoryRet {
	containers: InventoryContainer[];
	totalItems: number;
	totalUniqueItems: number;
}

// Constants for container types
const CONTAINER_TYPES = {
	PLAYER_INVENTORY: "Player Inventory",
	CHEST: "Chest",
	FRIDGE: "Fridge",
	BUILDING_OUTPUT: "Building Output",
	BUILDING_STORAGE: "Building Storage",
	UNKNOWN: "Unknown",
} as const;

// Skip paths for player inventories
const SKIP_PATHS = ["SaveGame.player", "SaveGame.farmhands.Farmer"];

// Utility function to parse paths efficiently
function parsePath(path: string) {
	const parts = path.split(".");
	const hasHeldObject = path.includes("heldObject");
	const buildingMatch = path.match(/Building\[(\d+)\]/);
	const playerMatch = path.match(/Player\[(\d+)\]/);

	return {
		parts,
		hasHeldObject,
		buildingIndex: buildingMatch?.[1],
		playerIndex: playerMatch?.[1],
		isFridge: path.includes("fridge"),
		isOutput: path.includes("output"),
		isBuilding: path.includes("Building"),
		isPlayer: path.includes("Player"),
	};
}

// Optimized function to get object by path
function getObjectByPath(obj: any, pathParts: string[], endIndex: number): any {
	let current = obj;
	for (let i = 1; i < endIndex; i++) {
		const part = pathParts[i];
		const bracketIndex = part.indexOf("[");

		if (bracketIndex !== -1) {
			const arrayName = part.substring(0, bracketIndex);
			const index = parseInt(
				part.substring(bracketIndex + 1, part.indexOf("]")),
			);
			current = current[arrayName]?.[index];
		} else {
			current = current[part];
		}

		if (!current) return null;
	}
	return current;
}

function getParentObjectName(
	saveGame: any,
	pathInfo: ReturnType<typeof parsePath>,
): string | null {
	if (!pathInfo.hasHeldObject) return null;

	try {
		const heldObjectIndex = pathInfo.parts.findIndex((part) =>
			part.includes("heldObject"),
		);
		if (heldObjectIndex === -1) return null;

		const parent = getObjectByPath(saveGame, pathInfo.parts, heldObjectIndex);
		return parent?.name || parent?.Name || null;
	} catch {
		return null;
	}
}

function getBuildingType(
	saveGame: any,
	pathInfo: ReturnType<typeof parsePath>,
): string | null {
	if (!pathInfo.buildingIndex) return null;

	try {
		const buildingIndex = pathInfo.parts.findIndex((part) =>
			part.includes("Building["),
		);
		if (buildingIndex === -1) return null;

		const building = getObjectByPath(
			saveGame,
			pathInfo.parts,
			buildingIndex + 1,
		);
		return (
			building?.["@_xsi:type"] || building?.indoors?.["@_xsi:type"] || null
		);
	} catch {
		return null;
	}
}

function determineContainerType(
	obj: any,
	pathInfo: ReturnType<typeof parsePath>,
	saveGame?: any,
): string {
	if (pathInfo.isPlayer) return CONTAINER_TYPES.PLAYER_INVENTORY;
	if (pathInfo.isFridge) return CONTAINER_TYPES.FRIDGE;
	if (pathInfo.isOutput) return CONTAINER_TYPES.BUILDING_OUTPUT;
	if (pathInfo.isBuilding) return CONTAINER_TYPES.BUILDING_STORAGE;

	if (obj["@_xsi:type"] === "Chest") {
		if (pathInfo.hasHeldObject) {
			const parentName = getParentObjectName(saveGame, pathInfo);
			return parentName ? `${parentName} Storage` : CONTAINER_TYPES.CHEST;
		}
		return CONTAINER_TYPES.CHEST;
	}

	return CONTAINER_TYPES.UNKNOWN;
}

function shouldSkipPath(path: string): boolean {
	return SKIP_PATHS.some((skipPath) => path.includes(skipPath));
}

function findItemContainers(
	obj: any,
	path = "",
	saveGame?: any,
): InventoryContainer[] {
	if (!obj || typeof obj !== "object") return [];

	const containers: InventoryContainer[] = [];

	// Check if this object has items
	if (obj.items?.Item) {
		if (shouldSkipPath(path)) return [];

		const items = parseItems(obj.items.Item);
		if (items.length === 0) return containers;

		const pathInfo = parsePath(path);
		const containerType = determineContainerType(obj, pathInfo, saveGame);
		const location =
			getBuildingType(saveGame, pathInfo) || pathInfo.buildingIndex || "";

		containers.push({
			type: containerType,
			location,
			items,
		});
	}

	// Recursively search through all properties
	for (const [key, value] of Object.entries(obj)) {
		if (!value || typeof value !== "object") continue;

		const currentPath = path ? `${path}.${key}` : key;

		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				if (item && typeof item === "object") {
					containers.push(
						...findItemContainers(item, `${currentPath}[${index}]`, saveGame),
					);
				}
			});
		} else {
			containers.push(...findItemContainers(value, currentPath, saveGame));
		}
	}

	return containers;
}

function parseItems(itemsData: any): InventoryItem[] {
	if (!itemsData) return [];

	const itemsArray = Array.isArray(itemsData) ? itemsData : [itemsData];
	const items: InventoryItem[] = [];

	for (const item of itemsArray) {
		if (!item || typeof item !== "object" || item.parentSheetIndex == null) {
			continue;
		}

		items.push({
			name: item.name || item.Name || "",
			type: item.type || "",
			quality: item.quality || 0,
			stack: item.stack || item.Stack || 1,
			index: item.parentSheetIndex || 0,
			category: item.category || -1,
			parentSheetIndex: item.parentSheetIndex || 0,
		});
	}

	return items;
}

export function parseInventory(
	prefix: string,
	SaveGame: any,
	player?: any,
): InventoryRet {
	try {
		// Search through the entire SaveGame object
		const allContainers = findItemContainers(SaveGame, "SaveGame", SaveGame);

		// Also search through player object if provided
		if (player) {
			allContainers.push(...findItemContainers(player, "Player", SaveGame));
		}

		// Calculate totals efficiently
		let totalItems = 0;
		const uniqueItems = new Set<number>();

		for (const container of allContainers) {
			totalItems += container.items.length;
			for (const item of container.items) {
				uniqueItems.add(item.index);
			}
		}

		return {
			containers: allContainers,
			totalItems,
			totalUniqueItems: uniqueItems.size,
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		throw new Error(`Error in parseInventory: ${message}`);
	}
}
