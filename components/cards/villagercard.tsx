import { useKV } from "../../hooks/useKV";
import Image from "next/image";

import { HeartIcon } from "@heroicons/react/solid";
import { useState } from "react";

interface Props {
  name: string;
  iconURL: string;
  isDateable: boolean;
  married?: boolean;
}

const VillagerCard = ({ name, iconURL, isDateable, married }: Props) => {
  const [spouse] = useKV("family", "spouse", "Haley");
  const [hearts, setHearts] = useState<number>(-1);

  const TenHearts = () => {
    let icons: JSX.Element[] = [];
    for (let i = 0; i < (married ? 14 : isDateable ? 10 : 8); i++) {
      icons.push(
        <HeartIcon
          className={
            "h-5 w-5 " +
            (i > 7 && !married // show disabled hearts 9 and 10 if married (can't date this NPC while married)
              ? "text-gray-500 dark:text-black" // married, can't reach 10 hearts
              : hearts >= i
              ? "text-red-400 hover:text-red-600"
              : "text-gray-300 hover:text-red-400 dark:text-[#2a2a2a]") // not married, can reach 10 hearts
          }
          aria-hidden="true"
          onClick={() => setHearts(i)}
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
      <div className="flex">{TenHearts()}</div>
    </div>
  );
};

export default VillagerCard;
