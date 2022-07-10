import type { Fish } from "../types";

import { CheckCircleIcon } from "@heroicons/react/outline";
import { Dispatch, SetStateAction } from "react";

type Props = {
  fish: Fish;
  isChecked: boolean;
  setSelectedFish: (fish: Fish) => void;
  setShowFish: Dispatch<SetStateAction<boolean>>;
};

const FishCard = ({ fish, isChecked, setSelectedFish, setShowFish }: Props) => {
  return (
    <div
      className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400"
      onClick={() => {
        setSelectedFish(fish);
        setShowFish(true);
        // console.log(fish.name);
      }}
    >
      <div className="flex-shrink-0">
        <img className="h-8 w-8" src={fish.iconUrl} alt={fish.name} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{fish.name}</p>
        <p className="text-sm text-gray-400">{fish.description}</p>
      </div>
      <CheckCircleIcon
        className={
          "h-5 w-5 " + (isChecked ? "text-green-500" : "text-gray-300")
        }
      />
    </div>
  );
};

export default FishCard;
