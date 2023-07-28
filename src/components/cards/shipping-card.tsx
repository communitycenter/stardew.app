import Image from "next/image";

import objects from "@/data/objects.json";

import type { ShippingItem } from "@/types/items";

import { cn } from "@/lib/utils";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

interface Props {
  item: ShippingItem;
  count: number;
  status: 0 | 1 | 2;
}

export const ShippingCard = ({ item, count, status }: Props) => {
  let colorClass = "";
  switch (status) {
    case 1:
      colorClass =
        "border-yellow-900 bg-yellow-500/20 hover:bg-yellow-500/30 dark:bg-yellow-500/10 hover:dark:bg-yellow-500/20";
      break;
    case 2:
      colorClass =
        "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20";
      break;
    default:
      colorClass =
        "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";
      break;
  }
  const iconURL =
    objects[item.itemID.toString() as keyof typeof objects].iconURL;

  const name = objects[item.itemID.toString() as keyof typeof objects].name;

  const description =
    objects[item.itemID.toString() as keyof typeof objects].description;

  return (
    <a
      className={cn(
        "flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5 text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer",
        colorClass
      )}
      target="_blank"
      rel="noreferrer"
      href={`https://stardewvalleywiki.com/${name.replaceAll(" ", "_")}`}
    >
      <Image
        src={iconURL}
        alt={name}
        className="rounded-sm"
        width={32}
        height={32}
      />
      <div className="min-w-0 flex-1 pr-3">
        <p className="font-medium truncate">{`${name} (${count}x)`}</p>

        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
      <ArrowTopRightOnSquareIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
    </a>
  );
};
