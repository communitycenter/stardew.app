import { Dispatch, SetStateAction, useContext } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  target: string;
  _filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

const bubbleColors: Record<string, string> = {
  "0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // unknown or not completed
  "1": "border-yellow-900 bg-yellow-500/20", // known, but not completed
  "2": "border-green-900 bg-green-500/20", // completed
};

export const FilterButton = ({ title, target, _filter, setFilter }: Props) => {
  const { activePlayer } = useContext(PlayersContext);

  const handleClick = () => {
    setFilter((prev) => {
      if (prev === target) {
        return "all";
      }
      return target;
    });
  };

  return (
    <button
      className={cn(
        "flex items-center space-x-2 rounded-2xl border border-neutral-200 bg-white p-2 pr-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-800 hover:cursor-pointer disabled:hover:cursor-not-allowed disabled:hover:bg-white disabled:hover:dark:bg-neutral-950",
        _filter === target ? "bg-neutral-100 dark:bg-neutral-800" : ""
      )}
      onClick={() => handleClick()}
      disabled={!activePlayer}
    >
      <div
        className={cn("h-4 w-4 rounded-full border", bubbleColors[target])}
      />
      <p className="text-sm">{title}</p>
    </button>
  );
};
