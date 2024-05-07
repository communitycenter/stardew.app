import objects from "@/data/objects.json";

import { Dispatch, SetStateAction } from "react";

import { usePlayers } from "@/contexts/players-context";

import { BundleItemWithLocation } from "@/types/bundles";
import { BooleanCard } from "./boolean-card";
import { categoryIcons, goldIcons } from "@/lib/constants";

interface BundleItemCardProps {
  item: BundleItemWithLocation;
  completed?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setObject: any; // TODO: update as we add more types
  /**
   * Whether the user prefers to see new content
   *
   * @type {boolean}
   * @memberof BundleItemCardProps
   */
  show: boolean;
  /**
   * The handler to display the new content confirmation prompt
   *
   * @type {Dispatch<SetStateAction<boolean>>}
   * @memberof BundleItemCardProps
   */
  setPromptOpen?: Dispatch<SetStateAction<boolean>>;
}

export const BundleItemCard = ({
  item,
  show,
  completed,
  setIsOpen,
  setObject,
  setPromptOpen,
}: BundleItemCardProps) => {
  const { activePlayer, patchPlayer } = usePlayers();
  // let itemType = "O"; //Todo add item types to object data files, and use them here to hotswap data source
  // let dataSource = objects;
  let iconURL: string;
  let name: string;
  let description: string | undefined;
  let minVersion: string;
  let itemQuantity: number | undefined;
  let itemCopy: BundleItemWithLocation = { ...item };
  if (item.itemQuantity) {
    itemQuantity = item.itemQuantity;
  }
  let overrides: Record<string, string | number | boolean | undefined> = {};

  const categoryItems: Record<string, string> = {
    "-4": "Any Fish",
    "-5": "Any Egg",
    "-6": "Any Milk",
    "-777": "Wild Seeds (Any)",
  };

  if (item.itemID == "-1") {
    //Special case for handling gold in Vault bundles
    iconURL = goldIcons[item.itemQuantity.toString()];
    itemCopy.itemQuality = "0"; // For some reason they have "gold" quality in the data
    name = "Gold";
    description = "What do the Junimos need all this gold for?";
    minVersion = "1.5.0";
  } else if (item.itemID in categoryItems) {
    iconURL = categoryIcons[item.itemID];
    name = categoryItems[item.itemID];
    description = "Any item in this category will work.";
    minVersion = "1.5.0";
  } else {
    if (!objects[item.itemID as keyof typeof objects]) {
      console.error(`No object data for itemID ${item.itemID}`);
    } else {
      // TODO: update this to be able to receive an object type so this component
      // can also dispaly objects with other object type keys, like big objects (BO)
      iconURL = `https://cdn.stardew.app/images/(O)${item.itemID}.webp`;
      name = objects[item.itemID as keyof typeof objects]?.name;
      const descriptionHold =
        objects[item.itemID as keyof typeof objects]?.description;
      description = descriptionHold ? descriptionHold : undefined;
      minVersion = objects[item.itemID as keyof typeof objects]?.minVersion;
      overrides = {
        name:
          itemQuantity && itemQuantity > 1
            ? `${itemQuantity.toString()}x ${name}`
            : name,
        description: description,
        iconURL: iconURL,
        minVersion: minVersion,
      };
    }
  }

  async function handleStatusChange(status: number) {
    if (!activePlayer) return;

    const bundleItem = item as BundleItemWithLocation;
    const bundles = activePlayer?.bundles ?? [];
    const bundleIndex = bundles.findIndex(
      (bundleWithStatus) =>
        bundleWithStatus.bundle.name === bundleItem.bundleID,
    );

    if (bundleIndex === -1) return;

    let patch = {
      bundles: {
        [bundleIndex]: {
          bundleStatus: {
            [bundleItem.index]: status === 2,
          },
        },
      },
    };

    // When SV finishes a bundle, it marks a bunch of out of bounds indexes as true
    // Here we set them to false, since they're not actually items.
    if (status === 0) {
      for (
        let i = bundles[bundleIndex].bundle.items.length;
        i < bundles[bundleIndex].bundleStatus.length;
        i++
      ) {
        patch.bundles[bundleIndex].bundleStatus[i] = false;
      }
    }

    // @ts-ignore
    await patchPlayer(patch);
  }

  return (
    <BooleanCard
      item={itemCopy}
      overrides={overrides}
      quantity={
        itemCopy.itemID == "-1"
          ? undefined // Don't show number for gold
          : itemQuantity
      }
      quality={itemCopy.itemQuality}
      show={show}
      completed={completed}
      setIsOpen={setIsOpen}
      setObject={setObject}
      setPromptOpen={setPromptOpen}
      handleStatusChange={handleStatusChange}
    />
  );
};
