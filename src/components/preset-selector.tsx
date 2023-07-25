import { useContext, useState } from "react";

import { cn } from "@/lib/utils";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
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

import { PlayersContext } from "@/contexts/players-context";

export function PresetSelector() {
  const [open, setOpen] = useState(false);
  const { players, activePlayer, setActivePlayer } = useContext(PlayersContext);

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
            {activePlayer ? activePlayer.general.name : "Load a farmhand..."}
          </p>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search farmhands..." />
          <CommandEmpty>No farmhands found.</CommandEmpty>
          <CommandGroup heading="Farmhands">
            {players
              ? players.map((player: any) => (
                  <CommandItem
                    key={player.id}
                    onSelect={() => {
                      setActivePlayer(player);
                      setOpen(false);
                    }}
                    className=""
                  >
                    <p className="w-full max-w-full truncate">
                      {player.general.name}
                    </p>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        activePlayer?.general.name === player.general.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              : null}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
