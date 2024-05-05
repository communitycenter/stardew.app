/**
 * Represents a bundle and its completion status in the Community Center.
 * @property {Bundle} bundle - Detailed information about the bundle, including items required and rewards.
 * @property {boolean[]} bundleStatus - An array indicating the collection status of each item in the bundle.
 */
export interface BundleWithStatus {
  bundle: Bundle;
  bundleStatus: boolean[];
}

/**
 * Extends BundleWithStatus by adding a list of alternative bundles.
 * @property {Bundle[]} options - Additional bundle choices available.
 */
export interface BundleWithStatusAndOptions extends BundleWithStatus {
  options: Bundle[];
}

/**
 * Represents the quality of an item.
 * @property {ItemQuality} itemQuality - Enumerated value indicating item quality, ranging from common (0) to iridium (3).
 */
export type ItemQuality = "0" | "1" | "2" | "3";

/**
 * Represents an item within a bundle, including its ID, quantity, and quality.
 * @property {string} itemID - Unique identifier for the item.
 * @property {number} itemQuantity - Number of this item required to complete a bundle.
 * @property {ItemQuality} itemQuality - Quality level of the item.
 */
export type BundleItem = {
  itemID: string;
  itemQuantity: number;
  itemQuality: ItemQuality;
};

/**
 * Extends BundleItem by adding an array of alternative items.
 * @property {BundleItem[]} options - Alternative items that can also be used to fulfill the bundle requirements.
 */
export interface BundleItemWithOptions extends BundleItem {
  options: BundleItem[];
}

/**
 * Extends BundleItem to include the specific bundle and its index position within the Community Center.
 * @property {string} bundleID - Identifier for the bundle this item belongs to.
 * @property {number} index - Position of the item within the bundle.
 */
export interface BundleItemWithLocation extends BundleItem {
  bundleID: string;
  index: number;
}

/**
 * Combines BundleItemWithLocation and BundleItemWithOptions, including location, options, and item details.
 */
export interface BundleItemWithLocationAndOptions
  extends BundleItemWithLocation,
    BundleItemWithOptions {}

/**
 * Describes a reward for completing a bundle.
 * @property {string} itemType - Type of item rewarded.
 * @property {string} itemID - Unique identifier of the reward item.
 * @property {number} itemQuantity - Quantity of the reward item.
 */
export type BundleReward = {
  itemType: string;
  itemID: string;
  itemQuantity: number;
};

/**
 * Represents a bundle in the Community Center, including all items and the reward.
 * @property {string} name - Name of the bundle.
 * @property {CommunityCenterRoomName} areaName - Name of the room where the bundle is located, if applicable.
 * @property {string} localizedName - Localized name of the bundle, if different.
 * @property {number} color - Color code associated with the bundle.
 * @property {(BundleItem | Randomizer)[]} items - List of items or randomizers required for the bundle.
 * @property {number} itemsRequired - Number of items required to complete the bundle.
 * @property {BundleReward} bundleReward - Reward granted upon completion of the bundle.
 */
export interface Bundle {
  name: string;
  areaName?: CommunityCenterRoomName;
  localizedName?: string;
  color?: number;
  items: (BundleItem | Randomizer)[];
  itemsRequired: number;
  bundleReward: BundleReward;
}

/**
 * Represents a selection mechanism that chooses among several bundles or items.
 * @property {boolean} randomizer - Indicates that this is a randomizer object.
 * @property {(Bundle | BundleItem | Randomizer)[]} options - Possible items or bundles to select from.
 * @property {number} selectionCount - Number of items or bundles to select.
 */
export type Randomizer = {
  randomizer: true;
  options: (Bundle | BundleItem | Randomizer)[];
  selectionCount: number;
};

/**
 * Checks if the provided object is a Randomizer.
 * @param {any} obj - Object to check.
 * @returns {boolean} - True if the object is a Randomizer, otherwise false.
 */
export function isRandomizer(obj: any): obj is Randomizer {
  return obj.randomizer;
}

/**
 * Type representing a room in the Community Center, which can contain multiple bundles or randomizers.
 */
export type CommunityCenterRoom = (Randomizer | Bundle)[];

/**
 * Enumberated names of rooms in the Community Center.
 */
export type CommunityCenterRoomName =
  | "Pantry"
  | "Crafts Room"
  | "Fish Tank"
  | "Boiler Room"
  | "Vault"
  | "Bulletin Board"
  | "Abandoned Joja Mart";

/**
 * Represents the entire Community Center, mapping room names to their contents.
 */
export type CommunityCenter = Record<
  CommunityCenterRoomName,
  CommunityCenterRoom
>;
