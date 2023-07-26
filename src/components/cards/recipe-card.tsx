import { Dispatch, SetStateAction } from "react";

import { CookingRecipe } from "@/types/recipe";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  recipe: CookingRecipe;
  completed?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setObject: Dispatch<SetStateAction<CookingRecipe | null>>; // TODO: update as we add more types
}

export const RecipeCard = ({
  recipe,
  completed,
  setIsOpen,
  setObject,
}: Props) => {
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
        setObject(recipe);
        setIsOpen(true);
      }}
    >
      <Image
        src={recipe.iconURL}
        alt={recipe.name}
        className="rounded-sm"
        width={32}
        height={32}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{recipe.name}</p>
        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
          {recipe.description}
        </p>
      </div>
    </button>
  );
};
