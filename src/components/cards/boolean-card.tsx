import Image from "next/image";

import objects from "@/data/objects.json";

import type { FishType } from "@/types/items";

import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";

interface Props {
  fish: FishType;
  completed?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setObject: Dispatch<SetStateAction<FishType | null>>; // TODO: update as we add more types
}

export const BooleanCard = ({
  fish,
  completed,
  setIsOpen,
  setObject,
}: Props) => {
  const iconURL =
    objects[fish.itemID.toString() as keyof typeof objects].iconURL;
  const name = objects[fish.itemID.toString() as keyof typeof objects].name;
  const description =
    objects[fish.itemID.toString() as keyof typeof objects].description;

  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <button
      className={cn(
        "flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer",
        checkedClass
      )}
      onClick={() => {
        setObject(fish);
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
    </button>
  );
};
