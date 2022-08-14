import type { CookingRecipe } from "../../types/cookingRecipes";

import { CheckCircleIcon } from "@heroicons/react/outline";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useKV } from "../../hooks/useKV";

import Image from "next/image";

type Props = {
  recipe: CookingRecipe;
  setSelectedRecipe: Dispatch<SetStateAction<CookingRecipe>>;
  setShowRecipe: Dispatch<SetStateAction<boolean>>;
};

function useSingleAndDoubleClick(
  actionSimpleClick: Function,
  actionDoubleClick: Function,
  delay = 250
) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (click === 1) actionSimpleClick();
      setClick(0);
    }, delay);

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (click === 2) actionDoubleClick();

    return () => clearTimeout(timer);
  }, [click]);

  return () => setClick((prev) => prev + 1);
}

const RecipeCard = ({ recipe, setSelectedRecipe, setShowRecipe }: Props) => {
  const [checked, setChecked] = useKV<boolean>(
    "cooking",
    recipe.itemID.toString(),
    false
  );
  const className = "h-5 w-5 " + (checked ? "text-green-500" : "hidden");

  const oneClick = useCallback(() => {
    setSelectedRecipe(recipe);
    setShowRecipe(true);
  }, [recipe, setSelectedRecipe, setShowRecipe]);

  const twoClick = useCallback(() => {
    setChecked((old) => !old);
  }, [setChecked]);

  const click = useSingleAndDoubleClick(oneClick, twoClick);
  return (
    <div
      className="relative flex select-none items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]"
      onClick={click}
    >
      <div className="flex-shrink-0">
        <Image src={recipe.iconURL} alt={recipe.name} width={32} height={32} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {recipe.name}
        </p>
        <p className="truncate text-sm text-gray-400">{recipe.description}</p>
      </div>

      {checked !== null && <CheckCircleIcon className={className} />}
    </div>
  );
};

export default RecipeCard;
