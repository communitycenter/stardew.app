import type { NextPage } from "next";
import type { Fish } from "../types";

import objects from "../research/processors/data/objects.json";
import shipping from "../research/processors/data/shipment.json";
import sprites from "../research/processors/data/sprites.json";
import achievements from "../research/processors/data/achievements.json";

import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import FishSlideOver from "../components/slideovers/fishslideover";
import { useKV } from "../hooks/useKV";
import { InformationCircleIcon } from "@heroicons/react/solid";

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  Fisherman: 10,
  "Ol' Mariner": 24,
  "Master Angler": 67,
};

const Shipping: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  //   const [showFish, setShowFish] = useState<boolean>(false);
  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);
  const [name] = useKV("general", "name", "Farmer");
  const [totalShipped] = useKV("shipping", "numItems", 0);
  //   const [uniqueCaught] = useKV("fish", "uniqueCaught", 0);
  //   const [selectedFish, setSelectedFish] = useState<Fish>(
  //     Object.values(fishes)[0]
  //   );

  return (
    <>
      <Head>
        <title>stardew.app | Shipping</title>
        <meta
          name="description"
          content="Track your Stardew Valley farm and forage progress. See what items you need to ship for 100% completion on Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your Stardew Valley farm and forage progress. See what items you need to ship for 100% completion on Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your Stardew Valley farm and forage progress. See what items you need to ship for 100% completion on Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley shipping tracker, stardew valley, stardew, stardew checkup, stardew shipping, stardew 100% completion, stardew perfection tracker, stardew, valley, stardew farm and forage, stardew farm, stardew forage"
        />
      </Head>
      <SidebarLayout
        activeTab="Shipping"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Shipping
          </h1>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div>
            <h2 className="my-2 text-lg font-semibold text-gray-900 dark:text-white">
              Achievements
            </h2>
            {hasUploaded && (
              <InfoCard
                title={`${name} has shipped ${totalShipped} items.`}
                Icon={InformationCircleIcon}
              />
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "shipping")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
                    // initialChecked={
                    //   achievement.name === "Mother Catch"
                    //     ? totalCaught >= 100
                    //     : uniqueCaught >= requirements[achievement.name]
                    // }
                  />
                ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            All Items to Ship
          </h2>
          <div className="flex items-center space-x-4">
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20" />
                <p className="text-sm dark:text-white">Shipped Item</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]" />
                <p className="text-sm dark:text-white">Unshipped Item</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(shipping).map(([id, name]) => (
              <AchievementCard
                key={id}
                title={name}
                description={
                  Object.entries(objects).find(([oId, obj]) => oId === id)?.[1]
                    .description!
                }
                sourceURL={sprites[id as keyof typeof sprites]!}
                tag={"shipping"}
                id={id}
              />
            ))}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Shipping;
