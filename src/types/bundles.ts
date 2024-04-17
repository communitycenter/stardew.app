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
  itemName: string;
};

export type BundleReward = {
  itemType: string;
  itemName: string;
  itemID: string;
  itemQuantity: number;
};

export type CommunityCenter = Record<string, CommunityCenterRoom>;
export type CommunityCenterRoom = Record<string, Bundle>;
