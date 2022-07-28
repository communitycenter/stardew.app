import { Bundle, CommunityCenterRoom } from "../../types/bundles";
import itemIds from "../../research/processors/items.json";
import BundleItem from "./bundleCell";
import BundleCell from "./bundleCell";
import { useState } from "react";
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
  const [checkedItem, setCheckedItem] = useLocalStorageState("item", {});

  return (
    <div className="relative space-y-2 rounded-lg bg-white py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
      <div className="text-gray-900 dark:text-white">
        {bundleName} (0/{bundle.itemsRequired})
      </div>
      <div className="grid grid-flow-dense gap-4">
        {bundle.items.map((item, index) => (
          <BundleCell
            key={`${item.itemID}-${index}`}
            item={item}
            setSelectedItem={setSelectedItem}
            setShowItem={setShowItem}
            checked={false}
            setChecked={(value) => {
              setCheckedItem((old) => {
                return {
                  ...old,
                  bundleName: {
                    [item.itemID]: true,
                  },
                };
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BundleCard;
