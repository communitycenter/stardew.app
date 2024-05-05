import objects from "@/data/objects.json";

import type { ItemData, MuseumItem } from "@/types/items";

import { Dispatch, SetStateAction } from "react";

import { usePlayers } from "@/contexts/players-context";

import { NewItemBadge } from "@/components/new-item-badge";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { ItemQuality } from "@/types/bundles";
import { IconChevronRight } from "@tabler/icons-react";
import ItemWithOverlay from "../ui/item-with-overlay";

interface BooleanCardProps {
  item: ItemData | MuseumItem;
  overrides: {
    name?: string;
    description?: string;
    iconUrl?: string;
    minVersion?: string;
  };
  quantity?: number;
  quality?: ItemQuality;
  type?: "fish" | "artifact" | "mineral";
  completed?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setObject: any; // TODO: update as we add more types
  handleStatusChange?: (status: number) => void;

  /**
   * Whether the user prefers to see new content
   *
   * @type {boolean}
   * @memberof BooleanCardProps
   */
  show: boolean;

  /**
   * The handler to display the new content confirmation prompt
   *
   * @type {Dispatch<SetStateAction<boolean>>}
   * @memberof BooleanCardProps
   */
  setPromptOpen?: Dispatch<SetStateAction<boolean>>;
}

export const BooleanCard = ({
  item,
  overrides,
  quantity,
  quality,
  type,
  show,
  completed,
  setIsOpen,
  setObject,
  setPromptOpen,
  handleStatusChange,
}: BooleanCardProps) => {
  const { activePlayer, patchPlayer } = usePlayers();
  // let itemType = "O"; //Todo add item types to object data files, and use them here to hotswap data source
  // let dataSource = objects;
  let iconURL: string;
  let name: string;
  let description: string | null;
  let minVersion: string;

  iconURL =
    overrides?.iconUrl ||
    `https://cdn.stardew.app/images/(O)${item.itemID}.webp`;
  name = overrides?.name || objects[item.itemID as keyof typeof objects].name;
  description =
    overrides?.description ||
    objects[item.itemID as keyof typeof objects].description;
  minVersion =
    overrides?.minVersion ||
    objects[item.itemID as keyof typeof objects].minVersion;

  // TODO: Lift this out as a prop, so each page passes in their own handler.
  async function defaultHandleStatusChange(status: number) {
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

  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={
            "relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50 " +
            checkedClass
          }
          onClick={() => {
            if (minVersion === "1.6.0" && !show && !completed) {
              setPromptOpen?.(true);
              return;
            }
            setObject(item);
            setIsOpen(true);
          }}
        >
          {minVersion === "1.6.0" && <NewItemBadge version={minVersion} />}
          <div
            className={
              "flex items-center space-x-3 truncate text-left " +
              (minVersion === "1.6.0" && !show && !completed && "blur-sm")
            }
          >
            <ItemWithOverlay
              src={iconURL}
              alt={name}
              className="rounded-sm"
              width={32}
              height={32}
              quality={quality}
              quantity={quantity}
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
        <ContextMenuCheckboxItem
          className="gap-2 pl-8"
          checked={false}
          disabled={!activePlayer}
          data-umami-event={`Set ${completed ? "in" : ""}completed`}
          onClick={() => {
            handleStatusChange
              ? handleStatusChange(completed ? 0 : 2)
              : defaultHandleStatusChange(completed ? 0 : 2);
          }}
        >
          <div
            className={`h-4 w-4 rounded-full border ${completed ? "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950" : "border-green-900 bg-green-500/20 dark:bg-green-500/10"}`}
          />
          <p>{`Set ${completed ? "Inc" : "C"}omplete`}</p>
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
