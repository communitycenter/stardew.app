export type Bundle = {
  name: string;
  areaName?: string;
  localizedName?: string;
  color?: number;
  items: (BundleItem | Randomizer)[];
  itemsRequired: number;
  bundleReward: BundleReward;
};

export interface BundleWithStatus {
  bundle: Bundle;
  bundleStatus: boolean[];
}

export type BundleItem = {
  itemID: string;
  itemQuantity: number;
  itemQuality: string;
};

export type BundleItemWithLocation = BundleItem & {
  bundleID: string;
  index: number;
};

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
