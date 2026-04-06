// Interface for basic item data
export interface ItemData {
	itemID: string; // Unique identifier for the item
	minVersion: string; // Minimum version of the stardew for this item to appear
}

// Interface for items that can be fished
interface Fishable extends ItemData {
	locations: string[]; // Array of locations where the fish is found
	trapFish: boolean; // Flag indicating whether the item is obtained through a trap
}

// Interface for standard fish type items
interface Fish extends Fishable {
	difficulty: string; // Difficulty level of catching the fish
	minLevel: number; // Minimum player level required to catch the fish, 0-10
	seasons: string[]; // Seasons during which the fish can be caught, spring, summer, fall, winter
	time: string; // Time of day when the fish can be caught
	trapFish: false; // Indicator of fish being found in traps - Should be properly set through TrapFish
	weather: string; // Sunny, Rainy, Both
}

// Interface for trap-only fish type items
interface TrapFish extends Fishable {
	trapFish: true; // Specifically indicating that this type of fish can only be caught using traps
}

// Union type for fish that can be either a normal Fish or a TrapFish
export type FishType = Fish | TrapFish;

// Interface for achievements in the application
export interface Achievement {
	id: number; // Unique identifier for the achievement
	gameID: number | null; // SDV Internal ID for the achievement
	name: string; // Display name of the achievement
	description: string; // Description of what the achievement involves
	iconURL: string; // URL for the achievement's icon
}

// Interface for items that can be shipped
export interface ShippingItem extends ItemData {
	polyculture: boolean; // Whether the item contributes to polyculture achievements
	monoculture: boolean; // Whether the item contributes to monoculture achievements
	seasons: string[]; // Seasons during which the item can be shipped, spring, summer, fall, winter
}

// Interface for items that can be donated to a museum
export interface MuseumItem {
	itemID: string; // Unique identifier for the museum item
	locations?: string[]; // Optional list of locations where the item can be found
}

// Interface defining a single walnut type used in the application
export interface WalnutType {
	name: string; // Name of the walnut
	count: number; // Quantity of this type of walnut
	description: string; // Description of the walnut
}

// Mapping of string identifiers to WalnutType, used for managing collections of walnuts
export interface WalnutMapType {
	[key: string]: WalnutType;
}

// Interface for villager data
export interface Villager {
	birthday: string; // Villager's birthday
	datable: boolean; // Indicates if the villager has romance options - Vanilla default
	iconURL: string; // CDN URL of the villager's icon
	loves: string[]; // List of items that the villager loves to recieve as gifts
	name: string; // Name of the villager
}
