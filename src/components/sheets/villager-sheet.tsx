import Image from "next/image";

import objects from "@/data/objects.json";
import villagers from "@/data/villagers.json";

import type { Villager } from "@/types/items";

import { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// look at villagers.py console output for categories that appear
const categories: Record<string, { name: string; iconURL: string }> = {
  "-2": {
    name: "All Gems",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/6/6a/Emerald.png",
  },
  "-5": {
    name: "Any Egg",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/5/5d/Large_Egg.png",
  },
  "-6": {
    name: "Any Milk",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/9/92/Milk.png",
  },
  "-7": {
    name: "All Cooked Dishes",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/8/87/Survival_Burger.png",
  },
  "-12": {
    name: "All Geode Minerals",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/3/3f/Star_Shards.png",
  },
  "-26": {
    name: "All Artisan Goods",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/6/69/Wine.png",
  },
  "-75": {
    name: "All Vegetables",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/9/9d/Tomato.png",
  },
  "-79": {
    name: "All Fruits",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/6/6d/Strawberry.png",
  },
  "-80": {
    name: "All Flowers",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/c/cf/Tulip.png",
  },
  "-81": {
    name: "All Forageables",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png",
  },
};

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  villager: Villager;
}

export const VillagerSheet = ({ open, setIsOpen, villager }: Props) => {
  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader className="mt-4">
          <div className="flex justify-center">
            <Image
              src={villager.iconURL}
              alt={villager.name}
              height={64}
              width={64}
            />
          </div>
          <SheetTitle className="text-center">{villager.name}</SheetTitle>
          <SheetDescription className="text-center italic">
            {villager.birthday}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-4">
          <section className="space-y-2">
            <h3 className="font-semibold">Loved Gifts</h3>
            <Separator />
            <ul className="list-none list-inside grid grid-cols-2 gap-y-4">
              {villager.loves.map((itemID) => {
                let item;
                if (itemID > 0) {
                  item = objects[itemID.toString() as keyof typeof objects];
                } else {
                  item = { ...categories[itemID] };
                }
                return (
                  <li
                    key={itemID}
                    className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm truncate"
                  >
                    <div className="flex items-center space-x-1">
                      <Image
                        src={item.iconURL}
                        alt={item.name}
                        width={24}
                        height={24}
                        quality={25}
                      />
                      <p className="font-semibold truncate">• {item.name}</p>
                    </div>
                    {}
                  </li>
                );
              })}
            </ul>
          </section>
          <section className="space-y-2">
            <h3 className="font-semibold">Likes</h3>
            <Separator />
            <ul className="list-none list-inside grid grid-cols-2 gap-y-4">
              {villager.likes.map((itemID) => {
                let item;
                if (itemID > 0) {
                  item = objects[itemID.toString() as keyof typeof objects];
                } else {
                  item = { ...categories[itemID] };
                }
                return (
                  <li
                    key={itemID}
                    className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm truncate"
                  >
                    <div className="flex items-center space-x-1">
                      <Image
                        src={item.iconURL}
                        alt={item.name}
                        width={24}
                        height={24}
                        quality={25}
                      />
                      <p className="font-semibold truncate">• {item.name}</p>
                    </div>
                    {}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};
