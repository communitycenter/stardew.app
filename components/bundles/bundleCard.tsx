import { Bundle, BundleItem, CommunityCenterRoom } from "../../types/bundles";
import itemIds from "../../research/processors/data/items.json";
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

  const bundleFinished = hasItemCount === bundle.itemsRequired;

  return (
    <div
      className={classNames(
        "flex flex-col items-start rounded-xl border p-2 md:flex-row md:items-center",
        bundleFinished
          ? "border-green-300 bg-green-50"
          : "border-gray-100 bg-white"
      )}
    >
      <div className="flex flex-1 items-center">
        <div className="mt-3 ml-1 mr-4 md:mt-0 md:mr-2">
          <img
            className="h-14 w-14 md:h-7 md:w-7"
            src="https://stardewvalleywiki.com/mediawiki/images/b/b3/Bundle_Green.png"
            alt="wtf"
          />
        </div>
        <div className="text-xl text-gray-900 dark:text-white md:text-lg">
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
