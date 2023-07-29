import Image from "next/image";

import objects from "@/data/objects.json";
import bigCraftables from "@/data/big_craftables.json";

import { Dispatch, SetStateAction } from "react";

import { Recipe, CraftingRecipe } from "@/types/recipe";

import { cn } from "@/lib/utils";

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

  return (
    <button
      className={cn(
        "flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer",
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
        width={16}
        height={isCraftingRecipe(recipe) && recipe.isBigCraftable ? 32 : 16}
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
