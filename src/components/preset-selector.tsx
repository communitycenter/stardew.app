import Link from "next/link";

import type { PlayerType } from "@/contexts/players-context";

import { cn } from "@/lib/utils";
import { useContext, useState, useMemo } from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { CaretSortIcon, CheckIcon, PlusIcon } from "@radix-ui/react-icons";

export function PresetSelector() {
  const [open, setOpen] = useState(false);
  const { players, activePlayer, setActivePlayer } = useContext(PlayersContext);

  // get a unique list of all the values for player.general.farmInfo
  const farmNames: string[] = useMemo(() => {
    if (!players) return [];
    const farmNames = players.map((player: any) => player.general.farmInfo);
    // turn it into a set for unique values
    const uniqueFarmNames = new Set(farmNames);
    return Array.from(uniqueFarmNames);
  }, [players]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a farmhand..."
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px]"
        >
          <p className="w-full max-w-full truncate text-left">
            {activePlayer?.general?.name ?? "Load a farmhand..."}
          </p>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search farmhands..." />
          <CommandEmpty>No farmhands found.</CommandEmpty>
          {farmNames?.map((farmName) => (
            <CommandGroup key={farmName} heading={farmName.split(" (")[0]}>
              {players
                ?.filter((p: PlayerType) => p.general?.farmInfo === farmName)
                .map((player: PlayerType) => (
                  <CommandItem
                    key={player._id}
                    onSelect={() => {
                      setActivePlayer(player);
                      setOpen(false);
                    }}
                  >
                    <p className="w-full max-w-full truncate">
                      {player.general?.name ?? "Unnamed Farmhand"}
                    </p>
                    <span className="hidden">{player._id}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        activePlayer?._id == player._id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup>
            <CommandItem>
              <Link href="/editor/create" className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-2" />
                <p className="w-full max-w-full truncate">New Farmhand</p>
              </Link>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
