import Image from "next/image";

import bigCraftables from "@/data/big_craftables.json";
import objects from "@/data/objects.json";

import type { CraftingRecipe, Recipe } from "@/types/recipe";

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMixpanel } from "@/contexts/mixpanel-context";
import { useMediaQuery } from "@react-hook/media-query";
import { IconExternalLink } from "@tabler/icons-react";
import { CreatePlayerRedirect } from "../createPlayerRedirect";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";

interface Props<T extends Recipe> {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  recipe: T | null;
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

export const RecipeSheet = <T extends Recipe>({
  open,
  setIsOpen,
  recipe,
}: Props<T>) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);
  const [status, setStatus] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mixpanel = useMixpanel();

  useEffect(() => {
    if (!activePlayer || !recipe) return;
    if (isCraftingRecipe(recipe)) {
      setStatus(activePlayer.crafting?.recipes?.[recipe.itemID] ?? 0);
    } else {
      setStatus(activePlayer.cooking?.recipes?.[recipe.itemID] ?? 0);
    }
  }, [activePlayer, recipe]);

  // accepts any type that extends Recipe (CraftingRecipe, CookingRecipe, etc.)
  // returns true if the recipe is of type U and CraftingRecipe which for now
  // is just the type CraftingRecipes
  function isCraftingRecipe<U extends Recipe>(
    recipe: U
  ): recipe is U & CraftingRecipe {
    return "isBigCraftable" in recipe;
  }

  const iconURL = recipe
    ? isCraftingRecipe(recipe)
      ? recipe.isBigCraftable
        ? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
            .iconURL
        : objects[recipe.itemID.toString() as keyof typeof objects].iconURL
      : objects[recipe.itemID.toString() as keyof typeof objects].iconURL
    : "https://stardewvalleywiki.com/mediawiki/images/f/f3/Lost_Book.png";

  const name = recipe
    ? isCraftingRecipe(recipe)
      ? recipe.isBigCraftable
        ? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
            .name
        : objects[recipe.itemID.toString() as keyof typeof objects].name
      : objects[recipe.itemID.toString() as keyof typeof objects].name
    : null;

  const description = recipe
    ? isCraftingRecipe(recipe)
      ? recipe.isBigCraftable
        ? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
            .description
        : objects[recipe.itemID.toString() as keyof typeof objects].description
      : objects[recipe.itemID.toString() as keyof typeof objects].description
    : null;

  async function handleStatusChange(newStatus: number | null) {
    if (!activePlayer || !recipe) return;

    const patch = {
      [isCraftingRecipe(recipe) ? "crafting" : "cooking"]: {
        recipes: {
          [recipe.itemID]: newStatus,
        },
      },
    };

    patchPlayer(patch);
    setIsOpen(false);
  }

  function shouldDisableButton(status: number) {
    // if this is the current status, disable the button
    if (!recipe) return true;
    if (isCraftingRecipe(recipe)) {
      return status === activePlayer?.crafting?.recipes?.[recipe.itemID];
    } else {
      return status === activePlayer?.cooking?.recipes?.[recipe.itemID];
    }
  }

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader className="mt-4">
            <div className="flex justify-center">
              <Image
                src={
                  iconURL ??
                  "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png"
                }
                alt={name ? name : "No Info"}
                width={64}
                height={
                  recipe && isCraftingRecipe(recipe)
                    ? recipe.isBigCraftable
                      ? 128
                      : 64
                    : 64
                }
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
                <h3 className="font-semibold">Actions</h3>
                <Separator />
                <Select
                  value={status.toString()}
                  onValueChange={(val) => {
                    handleStatusChange(parseInt(val));
                    mixpanel?.track("Button Clicked", {
                      Action: `Set ${
                        parseInt(val) === 0
                          ? "Unknown"
                          : parseInt(val) === 1
                          ? "Known"
                          : "Completed"
                      }`,
                      Recipe: name,
                      "Card Type": "Recipe card",
                      Location: "Recipe sheet",
                    });
                  }}
                  disabled={!activePlayer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Change Status...">
                      {status === 0
                        ? "Unknown"
                        : status === 1
                        ? "Known"
                        : "Completed"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Change Status</SelectLabel>
                      <SelectItem value="0">
                        <div className="flex items-center gap-2">
                          <div className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 rounded-full h-4 w-4" />
                          <p>Set Unknown</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="1">
                        <div className="flex items-center gap-2">
                          <div className="border border-yellow-900 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full h-4 w-4" />
                          <p>Set Known</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex items-center gap-2">
                          <div className="border border-green-900 bg-green-500/20 dark:bg-green-500/10 rounded-full h-4 w-4" />
                          <p>Set Completed</p>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div>{!activePlayer && <CreatePlayerRedirect />}</div>
                {name && (
                  <Button
                    variant="outline"
                    data-umami-event="Visit wiki"
                    asChild
                    className="w-full"
                    onClick={() =>
                      mixpanel?.track("Button Clicked", {
                        Action: "Visit Wiki",
                        Location: "Fish sheet",
                      })
                    }
                  >
                    <a
                      className="flex items-center"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://stardewvalleywiki.com/${name.replaceAll(
                        " ",
                        "_"
                      )}`}
                    >
                      Visit Wiki Page
                      <IconExternalLink className="h-4"></IconExternalLink>
                    </a>
                  </Button>
                )}
              </section>
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
                    if (!ingredient.itemID.startsWith("-")) {
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
                            src={
                              item.iconURL ??
                              "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png"
                            }
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
  }

  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[90dvh]">
        <ScrollArea className="overflow-auto">
          <DrawerHeader className="mt-4 -mb-4">
            <div className="flex justify-center">
              <Image
                src={
                  iconURL ??
                  "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png"
                }
                alt={name ? name : "No Info"}
                width={64}
                height={
                  recipe && isCraftingRecipe(recipe)
                    ? recipe.isBigCraftable
                      ? 128
                      : 64
                    : 64
                }
              />
            </div>
            <DrawerTitle className="text-center">
              {name ? name : "No Info"}
            </DrawerTitle>
            <DrawerDescription className="text-center italic">
              {description ? description : "No Description Found"}
            </DrawerDescription>
          </DrawerHeader>
          {recipe && (
            <div className="space-y-6 p-6">
              <section className="space-y-2">
                <h3 className="font-semibold">Actions</h3>
                <Separator />
                <Select
                  value={status.toString()}
                  onValueChange={(val) => {
                    handleStatusChange(parseInt(val));
                    mixpanel?.track("Button Clicked", {
                      Action: `Set ${
                        parseInt(val) === 0
                          ? "Unknown"
                          : parseInt(val) === 1
                          ? "Known"
                          : "Completed"
                      }`,
                      Recipe: name,
                      "Card Type": "Recipe card",
                      Location: "Recipe sheet",
                    });
                  }}
                  disabled={!activePlayer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Change Status...">
                      {status === 0
                        ? "Unknown"
                        : status === 1
                        ? "Known"
                        : "Completed"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Change Status</SelectLabel>
                      <SelectItem value="0">
                        <div className="flex items-center gap-2">
                          <div className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 rounded-full h-4 w-4" />
                          <p>Set Unknown</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="1">
                        <div className="flex items-center gap-2">
                          <div className="border border-yellow-900 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full h-4 w-4" />
                          <p>Set Known</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex items-center gap-2">
                          <div className="border border-green-900 bg-green-500/20 dark:bg-green-500/10 rounded-full h-4 w-4" />
                          <p>Set Completed</p>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div>{!activePlayer && <CreatePlayerRedirect />}</div>
                {name && (
                  <Button
                    variant="outline"
                    data-umami-event="Visit wiki"
                    asChild
                    className="w-full"
                    onClick={() =>
                      mixpanel?.track("Button Clicked", {
                        Action: "Visit Wiki",
                        Location: "Fish sheet",
                      })
                    }
                  >
                    <a
                      className="flex items-center"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://stardewvalleywiki.com/${name.replaceAll(
                        " ",
                        "_"
                      )}`}
                    >
                      Visit Wiki Page
                      <IconExternalLink className="h-4"></IconExternalLink>
                    </a>
                  </Button>
                )}
              </section>
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
                    if (!ingredient.itemID.startsWith("-")) {
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
                            src={
                              item.iconURL ??
                              "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png"
                            }
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
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
