import objects from "@/data/objects.json";
const typedObjects: Record<
  string,
  Record<string, string | null>
> = objects as Record<string, Record<string, string | null>>;
import big_craftables from "@/data/big_craftables.json";
const typedBigCraftables: Record<
  string,
  Record<string, string | null>
> = big_craftables as Record<string, Record<string, string | null>>;
import { Bundle, BundleItem } from "@/types/bundles";

export interface BundleRet {
  bundle: Bundle;
  bundleStatus: boolean[];
}

interface BundleCompletionData {
  [bundleId: string]: boolean[];
}

export function parseBundles(
  bundleData: any,
  communityCenterLocation: any,
  gameVersion: string,
): BundleRet[] {
  try {
    let bundles: BundleRet[] = [];

    if (!bundleData || !communityCenterLocation) return bundles;

    let bundleCompletionData: BundleCompletionData = {};

    if (Array.isArray(communityCenterLocation.bundles.item)) {
      for (const idx in communityCenterLocation.bundles.item) {
        let bundle = communityCenterLocation.bundles.item[idx];
        let bundleId: string = bundle.key.int.toString();
        let bundleStatus: boolean[] = [];
        for (const item of bundle.value.ArrayOfBoolean.boolean) {
          bundleStatus.push(item);
        }
        bundleCompletionData[bundleId] = bundleStatus;
      }
    }

    for (const bundle of bundleData.item) {
      let bundleNameString: string = bundle.key.string;
      let areaName: string = bundleNameString.split("/")[0];
      let bundleId: string = bundleNameString.split("/")[1];

      let bundleDataString: string = bundle.value.string;

      let bundleDataSplit: string[] = bundleDataString.split("/");

      let bundleName: string = bundleDataSplit[0];

      let rewardDataString: string = bundleDataSplit[1];
      let rewardDataSplit: string[] = rewardDataString.split(" ");

      let bundleRequirementsDataString: string = bundleDataSplit[2];
      let bundleRequirementsDataSplit: string[] =
        bundleRequirementsDataString.split(" ");

      let colorId: string = bundleDataSplit[3];

      let requiredItemCount: number = bundleDataSplit[4]
        ? parseInt(bundleDataSplit[4])
        : -1;

      // bundleDataSplit[5] is usually empty, but seems to be used in the new remix bundles

      let localizedBundleName: string = bundleDataSplit[6];

      let requiredItems: BundleItem[] = [];
      for (let i = 0; i < bundleRequirementsDataSplit.length; i += 3) {
        let itemID: string = bundleRequirementsDataSplit[i];
        let itemQuantity: number = parseInt(bundleRequirementsDataSplit[i + 1]);
        let itemQuality: string = bundleRequirementsDataSplit[i + 2];

        // An item ID of -1 is used for gold for the vault room
        if (itemID == "-1") {
          let currentBundleItem: BundleItem = {
            itemID: "-1",
            itemQuantity: itemQuantity,
            itemQuality: itemQuality,
            itemName: "Gold",
          };
          requiredItems.push(currentBundleItem);
          continue;
        }

        let itemName: string = typedObjects[itemID].name || "";

        let currentBundleItem: BundleItem = {
          itemID: itemID,
          itemQuantity: itemQuantity,
          itemQuality: itemQuality,
          itemName: itemName,
        };

        requiredItems.push(currentBundleItem);
      }

      let itemData = null;
      if (rewardDataSplit[0] == "O") {
        itemData = typedObjects[rewardDataSplit[1]];
      }
      if (rewardDataSplit[0] == "BO") {
        itemData = typedBigCraftables[rewardDataSplit[1]];
      }

      // Ideally we'd pull reward data for other types from their respective data files,
      // but until those data files exist we'll just hardcode existing objects outside
      // of objects and big_craftables.
      if (!itemData) {
        // The missing bundle has an empty string for rewardDataString, so we need some
        // custom reward logic.
        if (rewardDataString == "") {
          itemData = {
            name: "Movie Theater unlock",
          };
        }
        if (rewardDataSplit[0] == "R" && rewardDataSplit[1] == "517") {
          itemData = {
            name: "Small Glow Ring",
          };
        }
        if (rewardDataSplit[0] == "R" && rewardDataSplit[1] == "518") {
          itemData = {
            name: "Small Magnet Ring",
          };
        }
        // Apparently the heater isn't defined in big_craftables, presumably because it's
        // not craftable.
        if (rewardDataSplit[0] == "BO" && rewardDataSplit[1] == "104") {
          itemData = {
            name: "Heater",
          };
        }
      }

      let currentBundle: Bundle = {
        areaName: areaName,
        localizedName: localizedBundleName ? localizedBundleName : bundleName,
        color: parseInt(colorId),
        items: requiredItems,
        itemsRequired: requiredItemCount,
        bundleReward: {
          itemType: rewardDataSplit[0] || "",
          itemName: itemData ? itemData.name || "" : "",
          itemID: rewardDataSplit[1] || "-1",
          itemQuantity: parseInt(rewardDataSplit[2] || "1"),
        },
      };

      let returnableBundle: BundleRet = {
        bundle: currentBundle,
        bundleStatus: bundleCompletionData[bundleId] || [],
      };

      bundles.push(returnableBundle);
    }

    return bundles;
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parseBundles: ${e.message}`);
    else throw new Error(`Error in parseBundles: ${e}`);
  }
}
