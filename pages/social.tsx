import type { NextPage } from "next";

import achievements from "../research/processors/data/achievements.json";
import villagers from "../research/processors/data/villagers.json";

import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import VillagerCard from "../components/cards/villagercard";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import { useKV } from "../hooks/useKV";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import {
  InformationCircleIcon,
  HomeIcon,
  UsersIcon,
  EmojiSadIcon,
  HeartIcon,
} from "@heroicons/react/solid";

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  "D.I.Y.": 15,
  Artisan: 30,
  "Craft Master": 129,
};

const Social: NextPage = () => {
  const [hasUploaded] = useKV<boolean>("general", "user", false);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [name] = useKV<string>("general", "name", "Farmer");
  const [spouse] = useKV<string>("family", "spouse", "Haley");
  const [houseUpgradeLevel] = useKV<number>("family", "houseUpgradeLevel", 0);
  const [fiveHeartCount] = useKV<number>("family", "fiveHeartCount", 0);
  const [tenHeartCount] = useKV<number>("family", "tenHeartCount", 0);
  const [children] = useKV<Array<string>>("family", "children", []);

  return (
    <>
      <Head>
        <title>stardew.app | Relationships</title>
        <meta
          name="description"
          content="Track your Stardew Valley relationships progress. View your villager relationship levels with each Stardew Valley NPC as well information on the gifts that are the best or worst to gift them."
        />
        d
      </Head>
      <SidebarLayout
        activeTab="Family & Social"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Family & Relationships
          </h1>
          <div>
            <label className="flex cursor-pointer flex-col items-center rounded-md border border-gray-300 bg-white p-1 text-white hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
              <span className="flex justify-between">
                {" "}
                <FilterIcon
                  className="h-5 w-5 text-black dark:bg-[#1F1F1F] dark:text-white"
                  aria-hidden="true"
                />
              </span>
            </label>
          </div>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div>
            <h2 className="my-2 text-lg font-semibold text-gray-900 dark:text-white">
              Achievements
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <InfoCard
                title={`Five Heart Relationships`}
                Icon={HeartIcon}
                description={fiveHeartCount.toString()}
              />
              <InfoCard
                title={"Ten Heart Relationships"}
                Icon={HeartIcon}
                description={tenHeartCount.toString()}
              />
            </div>
            <h2 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Relationships
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-4 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "social")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
                  />
                ))}
            </div>
            <h2 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Home & Family
            </h2>

            <div className="mt-2 grid grid-cols-2 gap-4 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "home")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
                  />
                ))}
            </div>
          </div>

          {/* Home and Family Section */}
          <h2 className="mt-8 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Home & Family
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-4 xl:grid-cols-3">
            <InfoCard Icon={UsersIcon} title={"Spouse"} description={spouse} />
            <InfoCard
              Icon={HomeIcon}
              title={"House Upgrade Level"}
              description={houseUpgradeLevel.toString()}
            />
            <InfoCard
              Icon={EmojiSadIcon}
              title={"Children"}
              description={children.length.toString()}
            />
          </div>
          <div className="my-2" />
          {Object.values(villagers)
            .filter((villager: any) => villager.name === "Haley")
            .map((villager: any) => (
              <VillagerCard
                key={villager.name}
                iconURL={villager.iconURL}
                isDateable={true}
                name={villager.name}
                married={true}
              />
            ))}
          {/* End Home & Family */}

          {/* Villager Section */}
          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-white">
            Villagers
          </h2>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-3">
            {Object.values(villagers)
              .filter((villager: any) => villager.isDateable)
              .filter((villager: any) => villager.name !== spouse)
              .map((villager: any) => (
                <VillagerCard
                  key={villager.name}
                  name={villager.name}
                  iconURL={villager.iconURL}
                  isDateable={villager.isDateable}
                />
              ))}
            {Object.values(villagers)
              .filter((villager: any) => !villager.isDateable)
              .map((villager: any) => (
                <VillagerCard
                  key={villager.name}
                  name={villager.name}
                  iconURL={villager.iconURL}
                  isDateable={villager.isDateable}
                />
              ))}
          </div>
          {/* End Villager Section */}
        </div>
      </SidebarLayout>
    </>
  );
};

export default Social;
