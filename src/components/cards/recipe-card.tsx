import Image from "next/image";

import bigCraftables from "@/data/big_craftables.json";
import objects from "@/data/objects.json";

import type { CraftingRecipe, Recipe } from "@/types/recipe";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useContext } from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useMixpanel } from "@/contexts/mixpanel-context";
import { IconChevronRight } from "@tabler/icons-react";

interface Props<T extends Recipe> {
  recipe: T;
  status: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setObject: Dispatch<SetStateAction<T | null>>;
}

export const RecipeCard = <T extends Recipe>({
  recipe,
  status,
  setIsOpen,
  setObject,
}: Props<T>) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);
  const mixpanel = useMixpanel();

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

  // accepts any type that extends Recipe (CraftingRecipe, CookingRecipe, etc.)
  // returns true if the recipe is of type U and CraftingRecipe which for now
  // is just the type CraftingRecipes
  function isCraftingRecipe<U extends Recipe>(
    recipe: U
  ): recipe is U & CraftingRecipe {
    return "isBigCraftable" in recipe;
  }

  const iconURL = isCraftingRecipe(recipe)
    ? recipe.isBigCraftable
      ? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
          .iconURL
      : objects[recipe.itemID.toString() as keyof typeof objects].iconURL
    : objects[recipe.itemID.toString() as keyof typeof objects].iconURL;

  const name = isCraftingRecipe(recipe)
    ? recipe.isBigCraftable
      ? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
          .name
      : objects[recipe.itemID.toString() as keyof typeof objects].name
    : objects[recipe.itemID.toString() as keyof typeof objects].name;

  const description = isCraftingRecipe(recipe)
    ? recipe.isBigCraftable
      ? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
          .description
      : objects[recipe.itemID.toString() as keyof typeof objects].description
    : objects[recipe.itemID.toString() as keyof typeof objects].description;

  async function handleStatusChange(newStatus: number | null) {
    if (!activePlayer) return;

    const patch = {
      [isCraftingRecipe(recipe) ? "crafting" : "cooking"]: {
        recipes: {
          [recipe.itemID]: newStatus,
        },
      },
    };

    await patchPlayer(patch);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={cn(
            "flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer transition-colors",
            colorClass
          )}
          onClick={() => {
            setObject(recipe);
            setIsOpen(true);
          }}
        >
          <Image
            src={iconURL}
            alt={name}
            className="rounded-sm"
            width={isCraftingRecipe(recipe) && recipe.isBigCraftable ? 16 : 32}
            height={32}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{name}</p>
            <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          </div>
          <IconChevronRight className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuCheckboxItem
          className="pl-8 gap-2"
          checked={status === 0}
          disabled={status === 0 || !activePlayer}
          onClick={() => {
            handleStatusChange(null);
            mixpanel?.track("Context Button Clicked", {
              Action: "Set Unknown",
              Recipe: name,
              "Card Type": "Recipe card",
            });
          }}
        >
          <div className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 rounded-full h-4 w-4" />
          <p>Set Unknown</p>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          className="pl-8 gap-2"
          checked={status === 1}
          disabled={status === 1 || !activePlayer}
          onClick={() => {
            handleStatusChange(1);
            mixpanel?.track("Context Button Clicked", {
              Action: "Set Known",
              Recipe: name,
              "Card Type": "Recipe card",
            });
          }}
        >
          <div className="border border-yellow-900 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full h-4 w-4" />
          Set Known
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          className="pl-8 gap-2"
          checked={status === 2}
          disabled={status === 2 || !activePlayer}
          onClick={() => {
            handleStatusChange(2);
            mixpanel?.track("Context Button Clicked", {
              Action: "Set Completed",
              Recipe: name,
              "Card Type": "Recipe card",
            });
          }}
        >
          <div className="border border-green-900 bg-green-500/20 dark:bg-green-500/10 rounded-full h-4 w-4" />
          Set Completed
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
