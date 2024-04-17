export type Bundle = {
  areaName: string;
  localizedName: string;
  color: number;
  items: BundleItem[];
  itemsRequired: number;
  bundleReward: BundleReward;
};

export type BundleItem = {
  itemID: string;
  itemQuantity: number;
  itemQuality: string;
};

export type BundleReward = {
  itemType: string;
  itemID: number;
  itemQuantity: number;
};

export type Randomizer = {
  randomizer: true;
  options: (Bundle | BundleItem | Randomizer)[];
  selectionCoutn: number;
};

export type CommunityCenter = Record<string, CommunityCenterRoom>;
export type CommunityCenterRoom = (Randomizer | Bundle)[];
