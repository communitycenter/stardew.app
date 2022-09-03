import { Dispatch, SetStateAction } from "react";

interface Props {
  title: string;
  targetState: string;
  _filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

const boolOpts = new Set(["true", "false"]);

const bubbleColors: Record<string, string> = {
  true: "border-green-900 bg-green-500/20", // completed
  false: "border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]", // not completed
  "0": "border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]", // unknown
  "1": "border-yellow-900 bg-yellow-500/20", // known, but not completed
  "2": "border-green-900 bg-green-500/20", // completed
};

const FilterBtn = ({ title, targetState, _filter, setFilter }: Props) => {
  const type = boolOpts.has(targetState) ? "bool" : "num";

  // set true/false/0/1/2 to off
  // or set the state to the target state if filter is currently off
  const handleClick = (prev: string) => {
    if (prev === targetState) setFilter("off");
    else setFilter(targetState);
  };

  return (
    <div
      onClick={() => handleClick(_filter)}
      className={
        "flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#191919]" +
        (_filter === targetState
          ? " bg-[#e0e0e0] dark:bg-[#2A2A2A]" // the filter is currently on
          : "")
      }
    >
      <div
        className={"h-4 w-4 rounded-full border " + bubbleColors[targetState]}
      />
      <p className="text-sm dark:text-white">{title}</p>
    </div>
  );
};

export default FilterBtn;
