import { Bundle, BundleItem, CommunityCenterRoom } from "../../types/bundles";
import itemIds from "../../research/processors/items.json";
import BundleCell from "./bundleCell";
import { useCallback, useMemo, useState } from "react";
import { useLocalStorageState } from "../../hooks/use-local-storage";
import bundles from "../../pages/bundles";

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

  return (
    <div className="relative space-y-2 rounded-lg bg-white py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
      <div className="text-gray-900 dark:text-white">
        {bundleName} ({hasItemCount}/{bundle.itemsRequired})
      </div>
      <div className="grid grid-flow-dense gap-4">
        {bundle.items.map((item, index) => (
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
