import type { Fish } from "../../types";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useKV } from "../../hooks/useKV";

import Image from "next/image";

type Props = {
  itemObject: Fish | any;
  category: string;
  setSelected: Dispatch<SetStateAction<Fish | any>>;
  setShow: Dispatch<SetStateAction<boolean>>;
  setCount: Dispatch<SetStateAction<number>>;
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

const BooleanCard = ({
  itemObject,
  setSelected,
  setShow,
  category,
  setCount,
}: Props) => {
  const [checked, setChecked] = useKV<boolean>(
    category,
    itemObject.itemID.toString(),
    false
  );
  const className = checked
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] border-gray-300 bg-white";

  const oneClick = useCallback(() => {
    setSelected(itemObject);
    setShow(true);
  }, [itemObject, setSelected, setShow]);

  const twoClick = useCallback(() => {
    if (checked) {
      setCount((prev) => prev - 1);
    } else {
      setCount((prev) => prev + 1);
    }
    setChecked((old) => !old);
  }, [setChecked]);

  const click = useSingleAndDoubleClick(oneClick, twoClick);
  return (
    <div
      className={
        "relative flex select-none items-center space-x-3 rounded-lg border py-4 px-5 hover:cursor-pointer " +
        className
      }
      onClick={click}
    >
      <Image
        src={itemObject.iconURL}
        alt={itemObject.name}
        width={32}
        height={32}
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {itemObject.name}
        </p>
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
          {itemObject.description}
        </p>
      </div>

      {/* {checked !== null && <CheckCircleIcon className={className} />} */}
    </div>
  );
};

export default BooleanCard;
