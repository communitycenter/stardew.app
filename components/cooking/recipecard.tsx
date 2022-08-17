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
  recipe: any;
  category: string;
  bigCraftable?: boolean;
  setSelectedRecipe: Dispatch<SetStateAction<any>>;
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

const RecipeCard = ({
  recipe,
  category,
  bigCraftable,
  setSelectedRecipe,
  setShowRecipe,
}: Props) => {
  const [value, setValue] = useKV<number>(
    category,
    recipe.itemID.toString(),
    0
  );

  let boxColor = "";
  switch (value) {
    case 0: // unknown recipe
      boxColor +=
        "hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] border-gray-300 bg-white";
      break;
    case 1: // uncooked recipe
      boxColor += "border-yellow-900 bg-yellow-500/10 hover:bg-yellow-500/20";
      break;
    case 2: // cooked recipe
      boxColor += "border-green-900 bg-green-500/10 hover:bg-green-500/20";
      break;
    default:
      break;
  }

  const oneClick = useCallback(() => {
    setSelectedRecipe(recipe);
    setShowRecipe(true);
  }, [recipe, setSelectedRecipe, setShowRecipe]);

  const twoClick = useCallback(() => {
    setValue((prev) => (prev + 1) % 3);
  }, [setValue]);

  const click = useSingleAndDoubleClick(oneClick, twoClick);
  return (
    <div
      className={
        "relative flex select-none items-center space-x-3 rounded-lg border border-solid py-4 px-5 hover:cursor-pointer " +
        boxColor
      }
      onClick={click}
    >
      <div className="flex">
        <Image src={recipe.iconURL} alt={recipe.name} width={32} height={32} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {recipe.name}
        </p>
        <p className="truncate text-sm text-gray-400">{recipe.description}</p>
      </div>

      {/* {value !== null && <CheckCircleIcon className={checkColor} />} */}
    </div>
  );
};

export default RecipeCard;
