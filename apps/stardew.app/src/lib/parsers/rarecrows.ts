export interface RarecrowRet {
	rarecrows: string[]; // array of unique parentSheetIndex values found
}

// Recursive function to search through any object for rarecrows
function findRarecrowsInObject(obj: any, path: string = ""): any[] {
	const rarecrows: any[] = [];

	if (!obj || typeof obj !== "object") return rarecrows;

	// Check if this object itself is a rarecrow
	if (obj.name === "Rarecrow" && obj.parentSheetIndex) {
		rarecrows.push({
			...obj,
			foundAt: path,
			context: "direct",
		});
	}

	for (const [key, value] of Object.entries(obj)) {
		const currentPath = path ? `${path}.${key}` : key;

		if (value && typeof value === "object") {
			// If it's an array, check each item
			if (Array.isArray(value)) {
				value.forEach((item, index) => {
					if (item && typeof item === "object") {
						rarecrows.push(
							...findRarecrowsInObject(item, `${currentPath}[${index}]`),
						);
					}
				});
			} else {
				// If it's an object, recurse into it
				rarecrows.push(...findRarecrowsInObject(value, currentPath));
			}
		}
	}

	return rarecrows;
}

export function parseRarecrows(
	prefix: string,
	SaveGame: any,
	player: any,
): RarecrowRet {
	/*
		SCANS THE ENTIRE SAVE FILE for anything rarecrow-related.
		This is a comprehensive search that will find rarecrows anywhere in the save data.
	*/

	try {
		let rarecrowsSet = new Set<string>();

		// Search through the entire SaveGame object
		const allRarecrows = findRarecrowsInObject(SaveGame, "SaveGame");

		// Also search through player object if provided
		if (player) {
			const playerRarecrows = findRarecrowsInObject(player, "Player");
			allRarecrows.push(...playerRarecrows);

			// Also specifically check player inventory
			if (player.items && player.items.item) {
				const inventoryRarecrows = findRarecrowsInObject(
					player.items,
					"Player.items",
				);
				allRarecrows.push(...inventoryRarecrows);
			}
		}

		// Process all found rarecrows
		allRarecrows.forEach((rarecrow) => {
			const rarecrowType = rarecrow.parentSheetIndex.toString();
			rarecrowsSet.add(rarecrowType);
		});

		return { rarecrows: Array.from(rarecrowsSet) };
	} catch (err) {
		if (err instanceof Error)
			throw new Error(`Error in parseRarecrows: ${err.message}`);
		throw new Error(`Error in parseRarecrows: ${err}`);
	}
}
