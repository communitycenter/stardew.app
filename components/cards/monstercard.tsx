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
  monsterCategory: any;
  monsterInfo: any;
  setSelectedMonster: Dispatch<SetStateAction<any>>;
  setShowMonster: Dispatch<SetStateAction<boolean>>;
  //   setCompletedCount: Dispatch<SetStateAction<number>>;
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

const MonsterCard = ({
  monsterCategory,
  monsterInfo,
  setSelectedMonster,
  setShowMonster,
}: //   setSelectedMonster,
//   setShowMonster,
//   setCompletedCount,
Props) => {
  const [value, setValue] = useKV<number>(
    "mining",
    monsterCategory.toLowerCase(),
    0
  );

  let boxColor = "";

  if (value < monsterInfo.Quantity) {
    boxColor +=
      "hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] border-gray-300 bg-white";
  } else {
    boxColor +=
      "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:bg-green-500/20";
  }

  const oneClick = useCallback(() => {
    setSelectedMonster(monsterCategory);
    setShowMonster(true);
  }, [monsterCategory, setSelectedMonster, setShowMonster]);

  // const twoClick = useCallback(() => {
  //   // update counts based on state of recipe
  //   switch (value) {
  //     case 0: // unknown recipe so add to known count on update
  //       setKnownCount((knownCount) => knownCount + 1);
  //       break;
  //     case 1: // uncooked recipe so add to cooked count on update
  //       setCompletedCount((cookedCount) => cookedCount + 1);
  //       break;
  //     case 2: // cooked recipe so subtract from cooked and known count on update
  //       setCompletedCount((cookedCount) => cookedCount - 1);
  //       setKnownCount((knownCount) => knownCount - 1);
  //       break;
  //     default:
  //       break;
  //   }
  //   setValue((prev) => (prev + 1) % 3);
  // }, [setValue]);

  const click = useSingleAndDoubleClick(oneClick, oneClick);
  return (
    <div
      className={
        "relative flex select-none items-center space-x-3 rounded-lg border border-solid py-4 px-5 hover:cursor-pointer " +
        boxColor
      }
      onClick={click}
    >
      <div className="flex">
        <Image
          src={`https://stardewvalleywiki.com${monsterInfo["Monster Type"][0][1]}`}
          alt={monsterCategory}
          width={32}
          height={32}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {monsterCategory}
        </p>
        <p className="truncate text-sm text-gray-400">
          {value}
          {monsterInfo.Quantity <= value
            ? " killed"
            : `/${monsterInfo.Quantity} left`}
        </p>
      </div>

      {/* {value !== null && <CheckCircleIcon className={checkColor} />} */}
    </div>
  );
};

export default MonsterCard;
