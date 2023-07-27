import Image from "next/image";

import objects from "@/data/objects.json";

import type { CookingRecipe } from "@/types/recipe";

import { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  recipe: CookingRecipe | null; // TODO: update as we add more types
}

const categoryItems: Record<string, string> = {
  "-4": "Any Fish",
  "-5": "Any Egg",
  "-6": "Any Milk",
  "-777": "Wild Seeds (Any)",
};

const categoryIcons: Record<string, string> = {
  "-4": "https://stardewvalleywiki.com/mediawiki/images/0/04/Sardine.png",
  "-5": "https://stardewvalleywiki.com/mediawiki/images/5/5d/Large_Egg.png",
  "-6": "https://stardewvalleywiki.com/mediawiki/images/9/92/Milk.png",
  "-777":
    "https://stardewvalleywiki.com/mediawiki/images/3/39/Spring_Seeds.png",
};

export const CookingSheet = ({ open, setIsOpen, recipe }: Props) => {
  const iconURL = recipe
    ? objects[recipe.itemID.toString() as keyof typeof objects].iconURL
    : "https://stardewvalleywiki.com/mediawiki/images/f/f3/Lost_Book.png";

  const name =
    recipe && objects[recipe.itemID.toString() as keyof typeof objects].name;

  const description =
    recipe &&
    objects[recipe.itemID.toString() as keyof typeof objects].description;

  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader className="mt-4">
          <div className="flex justify-center">
            <Image
              src={iconURL}
              alt={name ? name : "No Info"}
              height={64}
              width={64}
            />
          </div>
          <SheetTitle className="text-center">
            {name ? name : "No Info"}
          </SheetTitle>
          <SheetDescription className="text-center italic">
            {description ? description : "No Description Found"}
          </SheetDescription>
        </SheetHeader>
        {recipe && (
          <div className="space-y-6 mt-4">
            <section className="space-y-2">
              <h3 className="font-semibold">How to unlock</h3>
              <Separator />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {recipe.unlockConditions}
              </p>
            </section>
            <section className="space-y-2">
              <h3 className="font-semibold">Ingredients</h3>
              <Separator />
              <ul className="list-none list-inside space-y-3">
                {recipe.ingredients.map((ingredient) => {
                  let item;

                  // if itemID is greater than 0, it's an object
                  if (ingredient.itemID > 0) {
                    item =
                      objects[
                        ingredient.itemID.toString() as keyof typeof objects
                      ];
                  } else {
                    // otherwise, it's a category
                    item = {
                      name: categoryItems[ingredient.itemID],
                      iconURL: categoryIcons[ingredient.itemID],
                    };
                  }

                  return (
                    <li
                      key={ingredient.itemID}
                      className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm font-semibold"
                    >
                      <div className="flex items-center space-x-2">
                        <Image
                          src={item.iconURL}
                          alt={item.name}
                          width={32}
                          height={32}
                          quality={25}
                        />
                        <p className="font-semibold">
                          • {item.name} ({ingredient.quantity}x)
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
