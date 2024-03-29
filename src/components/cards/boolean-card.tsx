import Image from "next/image";

import objects from "@/data/objects.json";

import type { FishType, MuseumItem } from "@/types/items";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

import { usePlayers } from "@/contexts/players-context";

import { NewItemBadge } from "@/components/new-item-badge";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { IconChevronRight } from "@tabler/icons-react";

interface Props {
  item: FishType | MuseumItem | any;
  completed?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setObject: any; // TODO: update as we add more types
  type: "fish" | "artifact" | "mineral";

  /**
   * Whether the user prefers to see new content
   *
   * @type {boolean}
   * @memberof Props
   */
  show: boolean;

  /**
   * The handler to display the new content confirmation prompt
   *
   * @type {Dispatch<SetStateAction<boolean>>}
   * @memberof Props
   */
  setPromptOpen?: Dispatch<SetStateAction<boolean>>;
}

export const BooleanCard = ({
  item,
  type,
  show,
  completed,
  setIsOpen,
  setObject,
  setPromptOpen,
}: Props) => {
  const { activePlayer, patchPlayer } = usePlayers();

  const iconURL = `https://cdn.stardew.app/images/(O)${item.itemID}.webp`;
  const name = objects[item.itemID as keyof typeof objects].name;
  const description = objects[item.itemID as keyof typeof objects].description;
  const minVersion = objects[item.itemID as keyof typeof objects].minVersion;

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

      if (status === 2) artifacts.add(item.itemID);
      if (status === 0) artifacts.delete(item.itemID);

      patch = {
        museum: {
          artifacts: Array.from(artifacts),
        },
      };
    } else if (type === "mineral") {
      const minerals = new Set(activePlayer?.museum?.minerals ?? []);

      if (status === 2) minerals.add(item.itemID);
      if (status === 0) minerals.delete(item.itemID);

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
            "relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50",
            checkedClass,
          )}
          onClick={() => {
            if (minVersion === "1.6.0" && !show && !completed) {
              setPromptOpen?.(true);
              return;
            }
            setObject(item);
            setIsOpen(true);
          }}
        >
          {minVersion === "1.6.0" && <NewItemBadge version={minVersion}/>}
          <div
            className={cn(
              "flex items-center space-x-3 truncate text-left",
              minVersion === "1.6.0" && !show && !completed && "blur-sm",
            )}
          >
            <Image
              src={iconURL}
              alt={name}
              className="rounded-sm"
              width={32}
              height={32}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{name}</p>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            </div>
          </div>
          <IconChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        {completed ? (
          <ContextMenuCheckboxItem
            className="gap-2 pl-8"
            checked={!completed}
            disabled={!completed || !activePlayer}
            data-umami-event="Set incompleted"
            onClick={() => {
              handleStatusChange(0);
            }}
          >
            <div className="h-4 w-4 rounded-full border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950" />
            <p>Set Incomplete</p>
          </ContextMenuCheckboxItem>
        ) : (
          <ContextMenuCheckboxItem
            className="gap-2 pl-8"
            checked={completed}
            disabled={completed || !activePlayer}
            onClick={() => {}}
            data-umami-event="Set completed"
          >
            <div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20 dark:bg-green-500/10" />
            Set Completed
          </ContextMenuCheckboxItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
