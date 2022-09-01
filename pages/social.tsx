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
  HomeIcon,
  UsersIcon,
  EmojiSadIcon,
  HeartIcon,
} from "@heroicons/react/solid";
import VillagerSlideOver from "../components/slideovers/villagerslideover";

// A way to check if we need to use tenHeartCount or fiveHeartCount
const tenHearts = new Set(["Best Friends", "The Beloved Farmer"]);

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  "A New Friend": 1,
  Cliques: 4,
  Networking: 10,
  Popular: 20,
  "Best Friends": 1,
  "The Beloved Farmer": 8,
  "Moving Up": 1,
  "Living Large": 2, // The Cellar (3rd upgrade) does not count for this
};

const Social: NextPage = () => {
  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);

  const [name] = useKV<string>("general", "name", "Farmer");
  const [spouse] = useKV<string>("family", "spouse", "No spouse");
  const [houseUpgradeLevel] = useKV<number>("family", "houseUpgradeLevel", 0);
  const [childrenLength] = useKV<number>("family", "childrenLength", 0);
  const [fiveHeartCount, setFiveHeartCount] = useKV<number>(
    "social",
    "fiveHeartCount",
    0
  );
  const [tenHeartCount, setTenHeartCount] = useKV<number>(
    "social",
    "tenHeartCount",
    0
  );

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showVillager, setShowVillager] = useState<boolean>(false);
  const [selectedVillager, setSelectedVillager] = useState<any>(
    Object.values(villagers)[0]
  );

  return (
    <>
      <Head>
        <title>stardew.app | Relationships</title>
        <meta
          name="description"
          content="Track your Stardew Valley relationships progress. View your villager relationship levels with each Stardew Valley NPC, as well information on the gifts that are the best or worst to gift them."
        />
        <meta
          name="og:description"
          content="Track your Stardew Valley relationships progress. View your villager relationship levels with each Stardew Valley NPC, as well information on the gifts that are the best or worst to gift them."
        />
        <meta
          name="twitter:description"
          content="Track your Stardew Valley relationships progress. View your villager relationship levels with each Stardew Valley NPC, as well information on the gifts that are the best or worst to gift them."
        />
        <meta
          name="keywords"
          content="stardew valley relationship tracker, stardew valley, stardew, stardew checkup, stardew relationships, stardew 100% completion, stardew perfection tracker, stardew, valley, stardew valley npc gifts, stardew valley shane, stardew valley npc loves, stardew valley npcs"
        />
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
              description={childrenLength.toString()}
            />
          </div>
          <div className="mt-4" />
          {Object.values(villagers)
            .filter((villager: any) => villager.name === spouse)
            .map((villager: any) => (
              <VillagerCard
                key={villager.name}
                iconURL={villager.iconURL}
                isDateable={true}
                name={villager.name}
                married={true}
                setSelectedVillager={setSelectedVillager}
                setShowVillager={setShowVillager}
                villagerObj={villager}
              />
            ))}
          {/* End Home & Family */}

          {/* Villager Section */}
          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-white">
            Villagers
          </h2>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Marriage Candidates */}
            {Object.values(villagers)
              .filter(
                (villager: any) =>
                  villager.isDateable && villager.name !== spouse // don't show spouse in list of villagers
              )
              .map((villager: any) => (
                <VillagerCard
                  key={villager.name}
                  name={villager.name}
                  iconURL={villager.iconURL}
                  isDateable={villager.isDateable}
                  setSelectedVillager={setSelectedVillager}
                  setShowVillager={setShowVillager}
                  villagerObj={villager}
                />
              ))}
            {/* End Marriage Candidates */}

            {/* Non Dateable Villagers */}
            {Object.values(villagers)
              .filter((villager: any) => !villager.isDateable)
              .map((villager: any) => (
                <VillagerCard
                  key={villager.name}
                  name={villager.name}
                  iconURL={villager.iconURL}
                  isDateable={villager.isDateable}
                  setSelectedVillager={setSelectedVillager}
                  setShowVillager={setShowVillager}
                  villagerObj={villager}
                />
              ))}
            {/* End Non Dateable Villagers */}
          </div>
          {/* End Villager Section */}
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
                    initialChecked={
                      tenHearts.has(achievement.name)
                        ? tenHeartCount >= requirements[achievement.name]
                        : fiveHeartCount >= requirements[achievement.name]
                    }
                    additionalDescription={
                      tenHearts.has(achievement.name)
                        ? ` - ${
                            requirements[achievement.name] - tenHeartCount
                          } more to go`
                        : ` - ${
                            requirements[achievement.name] - fiveHeartCount
                          } more to go`
                    }
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
                    initialChecked={
                      requirements.hasOwnProperty(achievement.name)
                        ? houseUpgradeLevel >= requirements[achievement.name]
                        : childrenLength >= 2 && spouse !== "No Spouse"
                    }
                    additionalDescription={
                      requirements.hasOwnProperty(achievement.name)
                        ? ` - ${
                            requirements[achievement.name] - houseUpgradeLevel
                          } more to go`
                        : ` - ${2 - childrenLength} more kid(s)` +
                          (spouse === "No spouse" ? " + Spouse needed" : "")
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </SidebarLayout>
      <VillagerSlideOver
        isOpen={showVillager}
        setOpen={setShowVillager}
        selected={selectedVillager}
        setFiveCount={setFiveHeartCount}
        setTenCount={setTenHeartCount}
      />
    </>
  );
};

export default Social;
