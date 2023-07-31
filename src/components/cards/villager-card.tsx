import Image from "next/image";

import type { Villager } from "@/types/items";

import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";

import { IconChevronRight } from "@tabler/icons-react";
import { HeartIcon } from "@heroicons/react/24/outline";

interface Props {
  villager: Villager;
  points: number;
  status: string | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setVillager: Dispatch<SetStateAction<Villager>>;
}

export const VillagerCard = ({
  villager,
  points,
  status,
  setIsOpen,
  setVillager,
}: Props) => {
  const hearts = Math.floor(points / 250);

  const getHearts = (count: number) => {
    let icons: JSX.Element[] = [];

    for (let i = 1; i < count + 1; i++) {
      icons.push(
        <HeartIcon
          key={i}
          className={cn(
            "h-5 w-5 text-neutral-500 dark:text-neutral-700",
            hearts >= i
              ? "fill-red-500 text-red-500 dark:text-red-500"
              : !status && villager.datable && i >= 9
              ? "fill-neutral-500 text-neutral-500 dark:text-neutral-700 dark:fill-neutral-700"
              : ""
          )}
        />
      );
    }

    return icons;
  };

  return (
    <button
      className="overflow-x-clip flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5 text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      onClick={() => {
        setVillager(villager);
        setIsOpen(true);
      }}
    >
      <Image
        src={villager.iconURL}
        alt={villager.name}
        width={32}
        height={32}
      />
      <div className="flex-1">
        <p className="font-medium truncate">{villager.name}</p>
        <div className="flex">
          {status === "Married" ? getHearts(14) : getHearts(10)}
        </div>
      </div>
      <IconChevronRight className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
    </button>
  );
};
