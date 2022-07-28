import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { BundleItem, CommunityCenterRoom } from "../../types/bundles";

type Props = {
  item: BundleItem;
  setSelectedItem: (item: CommunityCenterRoom) => void;
  setShowItem: Dispatch<SetStateAction<boolean>>;
  setChecked: Dispatch<SetStateAction<boolean | null>>;
  checked: boolean | null;
};

function useSingleAndDoubleClick(
  actionSimpleClick: Function,
  actionDoubleClick: Function,
  delay = 250
) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (click === 1) actionSimpleClick();
      setClick(0);
    }, delay);

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (click === 2) actionDoubleClick();

    return () => clearTimeout(timer);
  }, [click]);

  return () => setClick((prev) => prev + 1);
}

const BundleCell = ({
  item,
  setSelectedItem,
  setShowItem,
  setChecked,
  checked,
}: Props) => {
  const className = "h-5 w-5 " + (checked ? "text-green-500" : "hidden");

  function oneClick() {
    // setSelectedItem(item);
    setShowItem(true);
  }

  function twoClick() {
    setChecked((old) => !old);
  }

  const click = useSingleAndDoubleClick(oneClick, twoClick);

  return (
    <div
      key={item.itemID}
      className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]"
    >
      {/* <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
                    alt="wtf"
                  />
                </div> */}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {item.itemName}
        </p>
        <p className="truncate text-sm text-gray-400">
          {item.itemQuantity}x{" "}
          {item.itemQuality === "Common" ? "" : item.itemQuality}
        </p>
      </div>
    </div>
  );
};

export default BundleCell;
