import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import { useLocalStorageState } from "../hooks/use-local-storage";
import {
  HomeIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/solid";

import Head from "next/head";
import Image from "next/image";

import InfoCard from "../components/infocard";
import SkillDisplay from "../components/skilldisplay";
import AchievementCard from "../components/achievementcard";

import achievements from "../research/processors/data/achievements.json";

const initialCheckedAchievements = Object.fromEntries(
  Object.values(achievements).map((achievement) => {
    return [achievement.id, null];
  })
) as Record<number, boolean | null>;

const Farmer: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [checkedAchievements, setCheckedAchievements] = useLocalStorageState(
    "achievements",
    initialCheckedAchievements
  );

  //todo: get data from local storage or fetch from db if we're doing auth.

  return (
    <>
      <Head>
        <title>stardew.app | Farmer</title>
      </Head>
      <SidebarLayout
        activeTab="Farmer"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            General Information
          </h1>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-4 py-4">
            {/* General Farmer Info */}
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Farmer Information
              </div>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                <div className="col-span-2 xl:col-span-1">
                  <InfoCard title="clem" Icon={UserIcon} />
                </div>
                <InfoCard
                  title="No Onion Farm (Four Corners)"
                  Icon={HomeIcon}
                />
                <InfoCard title="Played for 74h 5m" Icon={ClockIcon} />
              </div>
            </div>
            {/* General Farmer Info */}
            {/* Money Stats */}
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Money
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <div className="col-span-2 xl:col-span-3">
                  <InfoCard
                    title="Earned 282,847g in total."
                    Icon={CurrencyDollarIcon}
                  />
                </div>
                {Object.values(achievements)
                  .filter((achievement) => achievement.id <= 4)
                  .map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      title={achievement.name}
                      description={achievement.description}
                      sourceURL={achievement.iconURL}
                      checked={checkedAchievements[achievement.id]}
                      setChecked={(value) => {
                        setCheckedAchievements((old) => {
                          return {
                            ...old,
                            [achievement.id]:
                              value instanceof Function
                                ? value(old[achievement.id])
                                : value,
                          };
                        });
                      }}
                    />
                  ))}
              </div>
            </div>
            {/* Money Stats */}
            {/* Skills Information */}
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Skills
              </div>
              <div className="grid grid-cols-5 gap-y-4 gap-x-1">
                <div className="col-span-5">
                  <InfoCard
                    title="clem's farmer level is 23."
                    Icon={ChartBarIcon}
                  />
                </div>
                <SkillDisplay
                  skill="Farming"
                  level={10}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/8/82/Farming_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Fishing"
                  level={9}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/e/e7/Fishing_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Foraging"
                  level={10}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/f/f1/Foraging_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Mining"
                  level={10}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/2/2f/Mining_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Combat"
                  level={10}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/c/cf/Combat_Skill_Icon.png"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <AchievementCard
                  title="Singular Talent"
                  description="Reach level 10 in a skill."
                  sourceURL="https://stardewvalleywiki.com/mediawiki/images/6/6f/Achievement_Singular_Talent.jpg"
                  checked={false}
                  setChecked={() => {}}
                />
                <AchievementCard
                  title="Master Of The Five Ways"
                  description="Reach level 10 in every skill."
                  sourceURL="https://stardewvalleywiki.com/mediawiki/images/4/49/Achievement_Master_Of_The_Five_Ways.jpg"
                  checked={false}
                  setChecked={() => {}}
                />
              </div>
            </div>
            {/* Skills Information */}
            {/* Quests Information */}
            {/* Quests Information */}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Farmer;
