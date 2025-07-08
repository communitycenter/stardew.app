import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const semverSatisfies = require("semver/functions/satisfies");

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Get a list of all farmhands in the save file.
 *
 * @param {*} saveGame The entire save game object from `saveFile.SaveGame`
 * @return {*} An array of farmhand objects
 */
export function getAllFarmhands(saveGame: any): any[] {
	let farmhands: any[] = [];
	const version: string = saveGame.gameVersion.toString();

	if (saveGame.player) {
		farmhands.push(saveGame.player);
	}

	if (semverSatisfies(version, "<1.6.0")) {
		// we'll need to recursively find all farmhands for <1.6
		farmhands = farmhands.concat(findAllByKey(saveGame, "farmhand"));
	} else {
		// for the new 1.6 format, there's a <farmhands> array tag with <Farmer> objects
		if (saveGame.farmhands && saveGame.farmhands.Farmer) {
			if (Array.isArray(saveGame.farmhands.Farmer)) {
				// multiple farmhands so we'll concat them
				farmhands = farmhands.concat(saveGame.farmhands.Farmer);
			} else {
				// only one farmhand
				farmhands.push(saveGame.farmhands.Farmer);
			}
		}
	}

	return farmhands;
}

function findAllByKey(obj: any, searchKey: string) {
	let results: any[] = [];

	Object.keys(obj).forEach((key) => {
		if (key === searchKey) {
			let farmhand = obj[key];

			if (!farmhand.name || !farmhand.UniqueMultiplayerID) {
				return;
			}

			results.push(obj[key]);
		} else if (typeof obj[key] === "object" && key !== "player") {
			results = results.concat(findAllByKey(obj[key], searchKey));
		}
	});
	return results;
}

export function deweaponize(incoming: string) {
	let str = incoming.toString();
	if (str.startsWith("(")) {
		const split = str.split(")");
		return {
			key: split[0].replace("(", ""),
			value: split[1].trim(),
		};
	} else {
		return {
			key: "",
			value: str,
		};
	}
}

/**
 * Check if the player object is in the new 1.6 format.
 *
 * @export
 * @param {*} player The player object to check
 * @return {*}  {boolean} True if the player object is in the new 1.6 format
 */
export function isPlayerFormatUpdated(player: any): boolean {
	const version = player.gameVersion.toString();
	if (version !== "-1" && semverSatisfies(version, ">=1.6")) return true;

	// just to be safe, we should check in multiple places for occurrences of the new format
	// but the only thing I can think of right now is the stats
	// player.stats.Values should be null for farmhands which haven't applied the 1.6 update
	if (player.stats && !player.stats.Values) return false;

	return true;
}

/**
 * Get the value for a stat in the new 1.6 format from player.stats.Values.
 *
 * @param {*} Values The player's stats.Values object.
 * @param {string} key The key of the stat to get.
 * @return {*}  {number} The value of the stat.
 */
export function GetStatValue(Values: any, key: string): number {
	let value = 0;

	if (!Values) return value;

	// there should, by default, be an array of items, but we'll check for a single item just in case
	if (!Array.isArray(Values.item)) {
		if (Values.item.key.string === key) {
			value = Values.item.value.unsignedInt;
		}
		return value;
	}

	for (const item of Values.item) {
		if (item.key.string === key) {
			value = item.value.unsignedInt;
			break;
		}
	}

	return value;
}

/**
 * Safely get a list from a field in an object, or return an empty array if the object is undefined.
 * Object may or may not be a list, some saves have only one item in the field.
 *
 * @param {*} obj The object to get the list from.
 * @param {string} key The key to get the list from.
 * @return {*}  {any[]} The list from the object, or an empty array if the object is undefined.
 */
export function GetListOrEmpty(obj: any, key: string): any[] {
	if (!obj || typeof obj === "undefined") return [];

	if (Array.isArray(obj[key])) {
		return obj[key];
	} else {
		return [obj[key]];
	}
}

/**
 * Check if the player has or will receive a mail.
 * Reference: `StardewValley.Farmer.cs::hasOrWillReceiveMail()`
 *
 * @param {string} mailId The mail ID to check for.
 * @param {Set<string>} mailReceived
 * @param {Set<string>} mailForTomorrow
 * @param {Set<string>} mailbox
 * @return {*} {boolean} True if the player has or will receive the mail.
 */
export function hasOrWillReceiveMail(
	mailId: string,
	mailReceived: Set<string>,
	mailForTomorrow: Set<string>,
	mailbox: Set<string>,
): boolean {
	if (
		!mailReceived.has(mailId) &&
		!mailForTomorrow.has(mailId) &&
		!mailbox.has(mailId)
	) {
		return mailForTomorrow.has(mailId + "%&NL&%");
	}
	return true;
}

/**
 * Returns the amount of mastery experience needed to achieve the given level.
 * Reference: `StardewValley.Menus.MasteryTrackerMenu.cs::getMasterExperienceForLevel()`
 *
 * @export
 * @param {number} level The level to get the experience needed for.
 * @return {*}  {number} The amount of experience needed to achieve the given level.
 */
export function getMasteryExpNeededForLevel(level: number): number {
	switch (level) {
		case 0:
			return 0;
		case 1:
			return 10_000;
		case 2:
			return 25_000;
		case 3:
			return 45_000;
		case 4:
			return 70_000;
		case 5:
			return 100_000;
		default:
			return Number.MAX_SAFE_INTEGER;
	}
}

/**
 * Returns the player's current mastery level based on their experience.
 * Reference: `StardewValley.Menus.MasteryTrackerMenu.cs::getCurrentMasteryLevel()`
 *
 * @export
 * @param {number} exp The player's current mastery experience.
 * @return {*}  {number} The player's current mastery level.
 */
export function getCurrentMasteryLevel(exp: number): number {
	let level = 0;

	for (let i = 1; i <= 5; i++) {
		if (exp >= getMasteryExpNeededForLevel(i)) {
			level++;
		}
	}
	return level;
}
