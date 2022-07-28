import { Bundle, BundleItem, CommunityCenterRoom } from "../../types/bundles";
import itemIds from "../../research/processors/items.json";
import BundleCell from "./bundleCell";
import { useCallback, useMemo, useState } from "react";
import { useLocalStorageState } from "../../hooks/use-local-storage";
import bundles from "../../pages/bundles";
import classnames from 'classnames'
import { CheckCircleIcon } from "@heroicons/react/outline";

type Props = {
  bundleName: string;
  bundle: Bundle;
};

const BundleCard = ({ bundleName, bundle }: Props) => {
  const [showItem, setShowItem] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CommunityCenterRoom>(
    Object.values(bundles)[0]
  );
  
  const [checkedItems, setCheckedItems] = useLocalStorageState<Record<string, Record<string, boolean>>>("items", {});

  const setChecked = useCallback((item: BundleItem, value: boolean) => {
    setCheckedItems((old) => {
      return {
        ...old,
        [bundleName]: {
          ...old[bundleName],
          [item.itemID]: value,
        },
      };
    });
  }, [setCheckedItems, bundleName]);

  const hasItemCount = useMemo(() => {
    if (!(bundleName in checkedItems)) return 0
    return Object.values(checkedItems[bundleName]).filter((item) => item == true).length
  }, [checkedItems, bundleName])

  const bundleFinished = hasItemCount === bundle.itemsRequired

  return (
    <div className={classnames(
      "flex flex-col md:flex-row border rounded-xl p-2 md:items-center items-start",
      {"border-green-300 bg-green-50": bundleFinished},
      {"border-gray-100 bg-white": !bundleFinished}
    )}>
      <div className="flex items-center flex-1">
        <div className="mt-3 md:mt-0 ml-1 mr-4 md:mr-2">
          <img
            className="h-14 w-14 md:h-7 md:w-7"
            src="https://stardewvalleywiki.com/mediawiki/images/b/b3/Bundle_Green.png"
            alt="wtf"
          />
        </div>
        <div className="text-gray-900 dark:text-white text-xl md:text-lg">
          {bundleName} {/*({hasItemCount}/{bundle.itemsRequired})*/}
        </div>
      </div>
      <div className="flex flex-wrap mt-4 md:mt-0 md:grid grid-flow-col grid-rows-2 lg:grid-rows-1 grid-cols-none md:direction-rtl gap-1">
        {bundle.items
          .filter(item => checkedItems[bundleName]?.[item.itemID] === true)
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
          .filter(item => checkedItems[bundleName]?.[item.itemID] !== true)
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
