import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import {
  HomeIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/solid";

import Head from "next/head";

import InfoCard from "../components/infocard";
import SkillDisplay from "../components/skilldisplay";
import AchievementCard from "../components/achievementcard";

import achievements from "../research/processors/data/achievements.json";
import { useKV } from "../hooks/useKV";

const Farmer: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [farmerLevel] = useKV<number>("levels", "player", 0);
  const [name] = useKV<string>("general", "name", "Farmer");
  const [farmInfo] = useKV<string>("general", "farmInfo", "No farm info");
  const [timePlayed] = useKV<string>("general", "timePlayed", "0h 0m");
  const [money] = useKV<number>("general", "money", 0);

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
                  <InfoCard title={name} Icon={UserIcon} />
                </div>
                <InfoCard title={farmInfo} Icon={HomeIcon} />
                <InfoCard title={timePlayed} Icon={ClockIcon} />
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
                    title={`Earned ${money.toLocaleString()}g in total.`}
                    Icon={CurrencyDollarIcon}
                  />
                </div>
                {Object.values(achievements)
                  .filter((achievement) => achievement.id <= 4)
                  .map((achievement) => (
                    <AchievementCard
                      id={achievement.id}
                      key={achievement.id}
                      title={achievement.name}
                      description={achievement.description}
                      sourceURL={achievement.iconURL}
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
              <div className="grid grid-cols-2 gap-4 gap-y-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
                <div className="col-span-2 lg:col-span-3 xl:col-span-5 2xl:col-span-5">
                  <InfoCard
                    title={`${name} is level ${farmerLevel}.`}
                    Icon={ChartBarIcon}
                  />
                </div>
                <SkillDisplay
                  skill="Farming"
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/8/82/Farming_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Fishing"
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/e/e7/Fishing_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Foraging"
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/f/f1/Foraging_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Mining"
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/2/2f/Mining_Skill_Icon.png"
                />
                <SkillDisplay
                  skill="Combat"
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/c/cf/Combat_Skill_Icon.png"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <AchievementCard
                  id={36}
                  title="Singular Talent"
                  description="Reach level 10 in a skill."
                  sourceURL="https://stardewvalleywiki.com/mediawiki/images/6/6f/Achievement_Singular_Talent.jpg"
                />
                <AchievementCard
                  id={37}
                  title="Master Of The Five Ways"
                  description="Reach level 10 in every skill."
                  sourceURL="https://stardewvalleywiki.com/mediawiki/images/4/49/Achievement_Master_Of_The_Five_Ways.jpg"
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
