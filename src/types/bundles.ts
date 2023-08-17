import bundlesJson from "../data/bundles.json";

export type Bundle = {
  items: BundleItem[];
  itemsRequired: number;
  bundleReward: BundleReward;
};

export type BundleItem = {
  itemID: number;
  itemQuantity: number;
  itemQuality: string;
  itemName: string;
};

export type BundleReward = {
  itemType: string;
  itemName: string;
  itemID: number;
  itemQuantity: number;
};

export type CommunityCenter = Record<string, CommunityCenterRoom>;
export type CommunityCenterRoom = Record<string, Bundle>;

export const communityCenter: CommunityCenter = bundlesJson;
