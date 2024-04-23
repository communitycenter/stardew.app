export interface Bundle {
  name: string;
  areaName?: CommunityCenterRoomName;
  localizedName?: string;
  color?: number;
  items: (BundleItem | Randomizer)[];
  itemsRequired: number;
  bundleReward: BundleReward;
}

export interface BundleWithStatus {
  bundle: Bundle;
  bundleStatus: boolean[];
}

export interface BundleWithStatusAndOptions extends BundleWithStatus {
  options: Bundle[];
}

export type BundleItem = {
  itemID: string;
  itemQuantity: number;
  itemQuality: string;
};

export interface BundleItemWithOptions extends BundleItem {
  options: BundleItem[];
}

export interface BundleItemWithLocation extends BundleItem {
  bundleID: string;
  index: number;
}

export interface BundleItemWithLocationAndOptions
  extends BundleItemWithLocation {
  options: BundleItem[];
}
export type BundleReward = {
  itemType: string;
  itemID: string;
  itemQuantity: number;
};

export type Randomizer = {
  randomizer: true;
  options: (Bundle | BundleItem | Randomizer)[];
  selectionCount: number;
};

export function isRandomizer(obj: any): obj is Randomizer {
  return obj.randomizer;
}

export type CommunityCenterRoomName =
  | "Pantry"
  | "Crafts Room"
  | "Fish Tank"
  | "Boiler Room"
  | "Vault"
  | "Bulletin Board"
  | "Abandoned Joja Mart";

export type CommunityCenter = Record<
  CommunityCenterRoomName,
  CommunityCenterRoom
>;
export type CommunityCenterRoom = (Randomizer | Bundle)[];
