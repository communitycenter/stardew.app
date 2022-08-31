import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useKV } from "../../hooks/useKV";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  id: number | string;
  title: string;
  description: string;
  sourceURL: string;
  tag: string;
  additionalDescription?: string;
  initialChecked?: boolean;
  size?: number;
  setCount?: Dispatch<SetStateAction<number>>;
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
  additionalDescription,
  id,
  initialChecked,
  tag,
  size,
  setCount,
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
    if (checked) setCount?.((prev: number) => prev - 1);
    else setCount?.((prev: number) => prev + 1);

    setChecked((old) => !old);
  }, [setChecked]);

  const click = useSingleAndDoubleClick(oneClick, twoClick);

  const className = checked
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:bg-green-500/20"
    : "hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] border-gray-300 bg-white";

  return (
    <motion.div layout>
      <div
        className={
          "relative flex select-none items-center space-x-3 rounded-lg border border-solid py-4 px-5 hover:cursor-pointer " +
          className
        }
        onClick={click}
      >
        <motion.div layout="position" className="flex">
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
              {description} {!checked ? additionalDescription : ""}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
