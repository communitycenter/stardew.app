import { ItemData } from "./items";

export type Bundle = {
  areaName: string;
  localizedName: string;
  color: number;
  items: (BundleItem | Randomizer)[];
  itemsRequired: number;
  bundleReward: BundleReward;
};

export type BundleItem = ItemData & {
  itemQuantity: number;
  itemQuality: string;
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
