import { useKV } from "../../hooks/useKV";
import Image from "next/image";

import { HeartIcon } from "@heroicons/react/solid";
import { useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  name: string;
  iconURL: string;
  isDateable: boolean;
  married?: boolean;
}

const VillagerCard = ({ name, iconURL, isDateable, married }: Props) => {
  const [spouse] = useKV("family", "spouse", "No spouse");
  // const [hearts, setHearts] = useState<number>(-1);
  const [points, setPoints] = useKV("social", name, 0);

  const hearts = Math.floor(points / 250);

  const EightHearts = () => {
    let icons: JSX.Element[] = [];
    for (let i = 1; i < 9; i++) {
      icons.push(
        <HeartIcon
          className={classNames(
            "h-5 w-5",
            hearts >= i
              ? "text-red-400 hover:text-red-600"
              : "text-gray-300 hover:text-red-400" //TODO: dark mode
          )}
          aria-hidden="true"
        />
      );
    }
    return icons;
  };

  const TenHearts = () => {
    let icons: JSX.Element[] = [];
    for (let i = 1; i < 11; i++) {
      icons.push(
        <HeartIcon
          className={classNames(
            "h-5 w-5",
            i >= 9 && spouse !== "No spouse"
              ? "text-black"
              : hearts >= i
              ? "text-red-400 hover:text-red-600"
              : "text-gray-300 hover:text-red-400" //TODO: dark mode
          )}
        />
      );
    }
    return icons;
  };

  const FourteenHearts = () => {
    let icons: JSX.Element[] = [];
    for (let i = 1; i < 15; i++) {
      icons.push(
        <HeartIcon
          className={classNames(
            "h-5 w-5",
            hearts >= i
              ? "text-red-400 hover:text-red-600"
              : "text-gray-300 hover:text-red-400" //TODO: dark mode
          )}
        />
      );
    }
    return icons;
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white py-3 px-4 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
      <div className="flex items-center space-x-2">
        <Image alt={name} src={iconURL} width={32} height={32} />
        <p className="text-sm text-gray-900 dark:text-white">{name}</p>
      </div>
      <div className="flex">
        {isDateable
          ? married
            ? FourteenHearts()
            : TenHearts()
          : EightHearts()}
      </div>
    </div>
  );
};

export default VillagerCard;
