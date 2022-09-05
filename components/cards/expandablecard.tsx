/*
  https://github.com/alii/website
  Shoutout alistair for the framer motion animations on the expandable cards 😙
*/

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useKV } from "../../hooks/useKV";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { ChevronRightIcon } from "@heroicons/react/solid";

type Props = {
  itemObject: any;
  category: string;
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

const ExpandableCard = ({ itemObject, category, setCount }: Props) => {
  const [isOpen, toggle] = useReducer((x) => !x, false);

  const [checked, setChecked] = useKV<boolean>(
    category,
    itemObject.itemID.toString(),
    false
  );
  const className = checked
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "hover:bg-white/10 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] border-gray-300 bg-white";

  const oneClick = useCallback(() => {
    toggle();
  }, [itemObject]);

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
    <motion.div
      animate={{ height: isOpen ? "auto" : "58px" }}
      className={
        "relative flex flex-col overflow-hidden rounded-md border no-underline " +
        className
      }
    >
      <button
        onClick={click}
        className="flex cursor-pointer select-none items-center space-x-4 border-b border-gray-900/50 py-4 px-5 text-sm font-semibold text-gray-900 focus:outline-none dark:border-white/10 dark:text-white"
      >
        <Image
          src={itemObject.iconURL}
          alt={itemObject.name ?? itemObject.title}
          width={24}
          height={24}
          quality={25}
        />
        <div className="flex flex-1 items-center space-x-2 text-left">
          <span>{itemObject.name ?? itemObject.title}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
          <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full"
          >
            <div className="flex flex-col space-y-4 py-4 px-5">
              <p className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                {itemObject.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* {checked !== null && <CheckCircleIcon className={className} />} */}
    </motion.div>
  );
};

export default ExpandableCard;
