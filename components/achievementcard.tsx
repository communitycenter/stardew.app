import { CheckCircleIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { useKV } from "../hooks/useKV";

interface Props {
  id: number | string;
  title: string;
  description: string;
  sourceURL: string;
  tag: string;
  initialChecked?: boolean;
  size?: number;
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
  description,
  id,
  initialChecked,
  tag,
  size,
}: Props) => {
  const [truncate, setTruncate] = useState(true);
  const [checked, setChecked] = useKV<boolean>(
    tag,
    id.toString(),
    initialChecked ?? false
  );
  const oneClick = useCallback(() => {
    setTruncate((old) => !old);
  }, [truncate]);
  const twoClick = useCallback(() => {
    setChecked((old) => !old);
  }, [setChecked]);

  const click = useSingleAndDoubleClick(oneClick, twoClick); // we don't need to do anything on a single click (? i think ?)

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
        width={size ?? 42}
        height={size ?? 42}
        className="rounded-sm"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className={"text-sm text-gray-400" + (truncate ? " truncate" : "")}>
          {description}
        </p>
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
