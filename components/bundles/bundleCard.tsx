import { Bundle, BundleItem, CommunityCenterRoom } from "../../types/bundles";
import itemIds from "../../research/processors/data/items.json";
import bundleSprites from "../../research/processors/data/bundle_sprites.json";

import BundleCell from "./bundleCell";
import { useCallback, useMemo, useState } from "react";
import { useLocalStorageState } from "../../hooks/use-local-storage";
import bundles from "../../pages/bundles";
import { CheckCircleIcon } from "@heroicons/react/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  bundleName: string;
  bundle: Bundle;
};

const BundleCard = ({ bundleName, bundle }: Props) => {
  const [showItem, setShowItem] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CommunityCenterRoom>(
    Object.values(bundles)[0]
  );

  const [checkedItems, setCheckedItems] = useLocalStorageState<
    Record<string, Record<string, boolean>>
  >("items", {});

  const setChecked = useCallback(
    (item: BundleItem, value: boolean) => {
      setCheckedItems((old) => {
        return {
          ...old,
          [bundleName]: {
            ...old[bundleName],
            [item.itemID]: value,
          },
        };
      });
    },
    [setCheckedItems, bundleName]
  );

  const hasItemCount = useMemo(() => {
    if (!(bundleName in checkedItems)) return 0;
    return Object.values(checkedItems[bundleName]).filter(
      (item) => item == true
    ).length;
  }, [checkedItems, bundleName]);

  // UI shows not finished if more than 3 are clicked.
  // Instead of having this be >=, it should be ===
  // but until we add some type of way to disable adding more items to a bundle
  // once completed, we'll leave it like this.
  const bundleFinished = hasItemCount >= bundle.itemsRequired;

  return (
    <div
      className={classNames(
        "flex flex-col items-start space-x-3 rounded-xl border border-solid border-gray-300 bg-white p-2 px-4 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] md:flex-row md:items-center",
        bundleFinished ? "border-green-300 bg-green-50" : ""
      )}
    >
      <div className="flex flex-1 items-center space-x-3">
        <div>
          <img
            className="mt-1 h-8 w-8"
            src={bundleSprites[bundleName as keyof typeof bundleSprites]}
            alt="wtf"
          />
        </div>
        <div className="font-medium text-gray-900 dark:text-white md:text-lg">
          {bundleName} {/*({hasItemCount}/{bundle.itemsRequired})*/}
        </div>
      </div>
      <div className="md:direction-rtl mt-4 flex grid-flow-col grid-cols-none grid-rows-2 flex-wrap gap-1 md:mt-0 md:grid lg:grid-rows-1">
        {bundle.items
          .filter((item) => checkedItems[bundleName]?.[item.itemID] === true)
          .sort((a, b) => b.itemQuantity - a.itemQuantity)
          .map((item, index) => (
            <BundleCell
              key={`${item.itemID}-${index}`}
              item={item}
              setSelectedItem={setSelectedItem}
              setShowItem={setShowItem}
              checked={checkedItems[bundleName]?.[item.itemID] === true}
              setChecked={setChecked}
            />
          ))}
        {bundle.items
          .filter((item) => checkedItems[bundleName]?.[item.itemID] !== true)
          .sort((a, b) => b.itemQuantity - a.itemQuantity)
          .map((item, index) => (
            <BundleCell
              key={`${item.itemID}-${index}`}
              item={item}
              setSelectedItem={setSelectedItem}
              setShowItem={setShowItem}
              checked={checkedItems[bundleName]?.[item.itemID] === true}
              setChecked={setChecked}
            />
          ))}
      </div>
    </div>
  );
};

export default BundleCard;
