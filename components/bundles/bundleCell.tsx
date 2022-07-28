import { Dispatch, SetStateAction, useState, useEffect, useCallback } from "react";
import { BundleItem, CommunityCenterRoom } from "../../types/bundles";
import classnames from 'classnames'
import { CheckCircleIcon } from "@heroicons/react/outline"

type Props = {
  item: BundleItem;
  setSelectedItem: (item: CommunityCenterRoom) => void;
  setShowItem: Dispatch<SetStateAction<boolean>>;
  setChecked: (item: BundleItem, value: boolean) => void;
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
    if (click === 2) {
      actionDoubleClick();
      setClick(0)
    }

    return () => clearTimeout(timer);
  }, [click, setClick, actionSimpleClick, actionDoubleClick, delay]);

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

  const oneClick = useCallback(() => {
    // setSelectedItem(item);
    setShowItem(true);
  }, [setShowItem]);

  const twoClick = useCallback(() => {
    setChecked(item, !checked)
  }, [item, checked, setChecked]);

  const click = useSingleAndDoubleClick(oneClick, twoClick);

  return (
    <div
      key={item.itemID}
      onClick={click}
      className={classnames(
        "p-2 border rounded-lg cursor-pointer select-none relative transition-colors",
        {"border-green-300 bg-green-100 hover:border-green-500 hover:bg-green-200": checked},
        {"border-gray-100 hover:border-gray-300 hover:bg-gray-50": !checked},
      )}
    >
      <div className="flex-shrink-0">
        <img
          className="h-12 w-12 md:h-6 md:w-6"
          src="https://stardewvalleywiki.com/mediawiki/images/f/f8/Corn.png"
          alt="wtf"
        />
      </div>
      {item.itemQuantity > 1 &&<span className="absolute -bottom-1.5 -right-1.5 text-sm md:text-xs bg-white border border-gray-100 px-1 rounded-md">
          {item.itemQuantity}x{" "}
      </span>}

      {/* <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {item.itemName}
        </p>
        <p className="truncate text-sm text-gray-400">
          {item.itemQuantity}x{" "}
          {item.itemQuality === "Common" ? "" : item.itemQuality}
        </p>
      </div>
      
      {checked !== null && <CheckCircleIcon className={className} />} */}
    </div>
  );
};

export default BundleCell;
