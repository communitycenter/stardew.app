import Image from "next/image";

import objects from "@/data/objects.json";

import type { FishType, TrinketItem } from "@/types/items";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useContext, useMemo } from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";

import { IconChevronRight } from "@tabler/icons-react";
import * as Fathom from "fathom-client";

interface Props {
  item: FishType | TrinketItem | any;
  completed?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setObject: any; // TODO: update as we add more types
  type: "fish" | "artifact" | "mineral";
}

export const BooleanCard = ({
  item,
  completed,
  setIsOpen,
  setObject,
  type,
}: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);

  const iconURL =
    objects[item.itemID.toString() as keyof typeof objects].iconURL;
  const name = objects[item.itemID.toString() as keyof typeof objects].name;
  const description =
    objects[item.itemID.toString() as keyof typeof objects].description;

  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  async function handleStatusChange(status: number) {
    if (!activePlayer) return;

    let patch = {};
    if (type === "fish") {
      const fishCaught = new Set(activePlayer?.fishing?.fishCaught ?? []);
      if (status === 2) fishCaught.add(item.itemID);
      if (status === 0) fishCaught.delete(item.itemID);

      patch = {
        fishing: {
          fishCaught: Array.from(fishCaught),
        },
      };
    } else if (type === "artifact") {
      const artifacts = new Set(activePlayer?.museum?.artifacts ?? []);

      if (status === 2) artifacts.add(parseInt(item.itemID));
      if (status === 0) artifacts.delete(parseInt(item.itemID));

      patch = {
        museum: {
          artifacts: Array.from(artifacts),
        },
      };
    } else if (type === "mineral") {
      const minerals = new Set(activePlayer?.museum?.minerals ?? []);

      if (status === 2) minerals.add(parseInt(item.itemID));
      if (status === 0) minerals.delete(parseInt(item.itemID));

      patch = {
        museum: {
          minerals: Array.from(minerals),
        },
      };
    }
    await patchPlayer(patch);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={cn(
            "flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5 text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer",
            checkedClass
          )}
          onClick={() => {
            setObject(item);
            setIsOpen(true);
          }}
        >
          <Image
            src={iconURL}
            alt={name}
            className="rounded-sm"
            width={32}
            height={32}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{name}</p>
            <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          </div>
          <IconChevronRight className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        {completed ? (
          <ContextMenuCheckboxItem
            className="pl-8 gap-2"
            checked={!completed}
            disabled={!completed || !activePlayer}
            onClick={() => {
              handleStatusChange(0);
              Fathom.trackGoal("OYQKZJFI", 0);
            }}
          >
            <div className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 rounded-full h-4 w-4" />
            <p>Set Incomplete</p>
          </ContextMenuCheckboxItem>
        ) : (
          <ContextMenuCheckboxItem
            className="pl-8 gap-2"
            checked={completed}
            disabled={completed || !activePlayer}
            onClick={() => {
              handleStatusChange(2);
              Fathom.trackGoal("VMKLGIUD", 0);
            }}
          >
            <div className="border border-green-900 bg-green-500/20 dark:bg-green-500/10 rounded-full h-4 w-4" />
            Set Completed
          </ContextMenuCheckboxItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
