import { CheckCircleIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
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
  }, []);
  const twoClick = useCallback(() => {
    setChecked((old) => !old);
  }, [setChecked]);

  const click = useSingleAndDoubleClick(oneClick, twoClick);

  return (
    <motion.div layout>
      <div
        className={
          "relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2a2a2a] dark:bg-[#1f1f1f] "
        }
        onClick={click}
      >
        <motion.div layout="position">
          <Image
            src={sourceURL}
            alt={title}
            width={size ?? 42}
            height={size ?? 42}
            className="rounded-sm"
          />
        </motion.div>
        <div className="min-w-0 flex-1">
          <motion.div layout="position">
            <p className="truncate font-medium text-gray-900 dark:text-white">
              {title}
            </p>
          </motion.div>
          <motion.div layout="position">
            <p
              className={
                "text-sm text-gray-400" + (truncate ? " truncate" : "")
              }
            >
              {description}
            </p>
          </motion.div>
        </div>
        {checked !== null && (
          <CheckCircleIcon
            className={"h-5 w-5 " + (checked ? "text-green-500" : "hidden")}
          />
        )}
      </div>
    </motion.div>
  );
};

export default AchievementCard;
