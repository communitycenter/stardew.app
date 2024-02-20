import { Dispatch, SetStateAction, useContext, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@radix-ui/react-icons";
import { Icon } from "@tabler/icons-react";

interface ButtonProps {
  title: string;
  target: string;
  _filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

interface DataItem {
  value: string;
  label: string;
}

interface SearchProps {
  title: string;
  target: string;
  _filter: string;
  data: DataItem[];
  icon: Icon;
  setFilter: Dispatch<SetStateAction<string>>;
}

const bubbleColors: Record<string, string> = {
  "0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // unknown or not completed
  "1": "border-yellow-900 bg-yellow-500/20", // known, but not completed
  "2": "border-green-900 bg-green-500/20", // completed
};

export const FilterButton = ({
  title,
  target,
  _filter,
  setFilter,
}: ButtonProps) => {
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
        "flex items-center space-x-2 rounded-lg border border-neutral-200 bg-white p-2 pr-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-800 hover:cursor-pointer disabled:hover:cursor-not-allowed disabled:hover:bg-white disabled:hover:dark:bg-neutral-950",
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

export const FilterSearch = ({
  title,
  target,
  _filter,
  data,
  icon,
  setFilter,
}: SearchProps) => {
  const { activePlayer } = useContext(PlayersContext);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleClick = () => {
    setFilter((prev) => {
      if (prev === target) {
        return "all";
      }
      return target;
    });
  };

  const Icon = icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          aria-expanded={open}
          className="flex items-center border justify-between rounded-md space-x-3 px-3 py-2.5 text-sm outline-none text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:border-neutral-800 hover:cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 opacity-50" />
            <p className="text-sm whitespace-nowrap	">
              {!value || value === "all" || value === "Both"
                ? title
                : data.find((item) => item.value === _filter)?.label}
            </p>
          </div>
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${title.toLocaleLowerCase()}...`}
          />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {data.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={(currentValue) => {
                  setFilter(item.value);
                  setValue(item.value);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
