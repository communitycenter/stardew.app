import Image from "next/image";

import { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";

import { CookingRecipe } from "@/types/recipe";
import objects from "@/data/objects.json";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  recipe: CookingRecipe | null;
}

const categoryItems: Record<string, string> = {
  "-4": "Any Fish",
  "-5": "Any Egg",
  "-6": "Any Milk",
  "-777": "Wild Seeds (Any)",
};

const categoryIcons: Record<string, string> = {
  "-4": "https://stardewvalleywiki.com/mediawiki/images/0/04/Sardine.png",
  "-5": "https://stardewvalleywiki.com/mediawiki/images/2/26/Egg.png",
  "-6": "https://stardewvalleywiki.com/mediawiki/images/9/92/Milk.png",
  "-777":
    "https://stardewcommunitywiki.com/mediawiki/images/3/39/Spring_Seeds.png",
};

export const CookingSheet = ({ open, setIsOpen, recipe }: Props) => {
  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader className="mt-4">
          <div className="flex justify-center">
            <Image
              src={
                recipe
                  ? recipe.iconURL
                  : "https://stardewvalleywiki.com/mediawiki/images/b/ba/Pufferfish.png"
              }
              alt={recipe ? recipe.name : "No Info"}
              height={64}
              width={64}
            />
          </div>
          <SheetTitle className="text-center">
            {recipe ? recipe.name : "No Info"}
          </SheetTitle>
          <SheetDescription className="text-center italic">
            {recipe ? recipe.description : "No Description Found"}
          </SheetDescription>
        </SheetHeader>
        {recipe && (
          <div className="space-y-4 mt-4">
            <section className="space-y-1">
              <h3 className="font-semibold">How to unlock</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {recipe.unlockConditions}
              </p>
            </section>
            <section className="space-y-1">
              <h3 className="font-semibold">Ingredients</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                <ul className="list-disc list-inside space-y-1">
                  {recipe.ingredients.map((ingredient) => {
                    let item;

                    if (ingredient.itemID > 0) {
                      const findItem = Object.entries(objects).find(
                        ([id, obj]) => id === ingredient.itemID.toString()
                      );
                      if (!findItem) return;
                      item = findItem[1];
                    } else {
                      item = {
                        name: categoryItems[ingredient.itemID],
                        iconURL: categoryIcons[ingredient.itemID],
                      };
                    }

                    return (
                      <div key={ingredient.itemID}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Image
                              src={item.iconURL}
                              alt={item.name}
                              width={32}
                              height={32}
                              quality={100}
                            />
                          </div>
                          <div className="ml-2 mb-2">
                            <div className="text-sm font-semibold">
                              {ingredient.amount}x {item.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ul>
              </p>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
