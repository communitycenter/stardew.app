import Image from "next/image";

import objects from "@/data/objects.json";

import type { FishType, MuseumItem } from "@/types/items";

import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { Dispatch, SetStateAction } from "react";

import { usePlayers } from "@/contexts/players-context";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import { NewItemBadge } from "@/components/new-item-badge";

import { useMixpanel } from "@/contexts/mixpanel-context";
import { IconChevronRight } from "@tabler/icons-react";

interface Props {
  item: FishType | MuseumItem | any;
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
  const showNewContent = getCookie("show_new_content");

  const { activePlayer, patchPlayer } = usePlayers();
  const mixpanel = useMixpanel();

  const iconURL =
    objects[item.itemID as keyof typeof objects].iconURL ??
    "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png";
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
            "relative flex select-none items-center justify-between rounded-lg border py-4 px-5 text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer",
            checkedClass
          )}
          onClick={() => {
            setObject(item);
            setIsOpen(true);
          }}
        >
          {minVersion === "1.6.0" && <NewItemBadge>✨1.6</NewItemBadge>}
          <div
            className={cn(
              "flex items-center text-left space-x-3 truncate",
              minVersion === "1.6.0" &&
                !showNewContent &&
                !completed &&
                "blur-sm"
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
              <p className="font-medium truncate">{name}</p>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            </div>
          </div>
          <IconChevronRight className="w-5 h-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        {completed ? (
          <ContextMenuCheckboxItem
            className="pl-8 gap-2"
            checked={!completed}
            disabled={!completed || !activePlayer}
            data-umami-event="Set incompleted"
            onClick={() => {
              handleStatusChange(0);
              mixpanel?.track("Context Button Clicked", {
                Action: "Set Incompleted",
                Type: type,
                "Card Type": "Recipe card",
              });
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
              mixpanel?.track("Context Button Clicked", {
                Action: "Set Completed",
                Item: name,
                "Card Type": "Boolean card",
              });
            }}
            data-umami-event="Set completed"
          >
            <div className="border border-green-900 bg-green-500/20 dark:bg-green-500/10 rounded-full h-4 w-4" />
            Set Completed
          </ContextMenuCheckboxItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
