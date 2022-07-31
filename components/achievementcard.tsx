import { CheckCircleIcon } from "@heroicons/react/outline";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface Props {
  title: string;
  description: string;
  sourceURL: string;
  setChecked: Dispatch<SetStateAction<boolean | null>>;
  checked: boolean | null;
}

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

const AchievementCard = ({
  title,
  sourceURL,
  checked,
  description,
  setChecked,
}: Props) => {
  const twoClick = useCallback(() => {
    setChecked((old) => !old);
  }, [setChecked]);

  const click = useSingleAndDoubleClick(() => {}, twoClick); // we don't need to do anything on a single click (? i think ?)

  return (
    <div
      className={
        "relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2a2a2a] dark:bg-[#1f1f1f] "
      }
      onClick={click}
    >
      <Image
        src={sourceURL}
        alt={title}
        width={42}
        height={42}
        className="rounded-sm"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 dark:text-white truncate">{title}</p>
        <p className="truncate text-sm text-gray-400">{description}</p>
      </div>
      {checked !== null && (
        <CheckCircleIcon
          className={"h-5 w-5 " + (checked ? "text-green-500" : "hidden")}
        />
      )}
    </div>
  );
};

export default AchievementCard;
