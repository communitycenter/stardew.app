import type { NextPage } from "next";

import achievements from "../research/processors/data/achievements.json";

import InfoCard from "../components/cards/infocard";
import AchievementCard from "../components/cards/achievementcard";
import SkillDisplay from "../components/skilldisplay";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import { useKV } from "../hooks/useKV";
import Head from "next/head";

import {
  HomeIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BriefcaseIcon,
  StarIcon,
} from "@heroicons/react/solid";

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  Greenhorn: 15000, // money needed to be earned
  Cowpoke: 50000,
  Homesteader: 250000,
  Millionaire: 1000000,
  Legend: 10000000,
  Gofer: 10, // quests to complete
  "A Big Help": 40,
  "Singular Talent": 1,
  "Master Of The Five Ways": 5,
};

const STARDROPS = {
  CF_Fair: {
    title: "Fair Star",
    description:
      "Can be purchased at the Stardew Valley Fair for 2,000 star tokens.",
  },
  CF_Fish: {
    title: "Fishing Star",
    description:
      "Received in mail from Willy after completing the Master Angler Achievement.",
  },
  CF_Mines: {
    title: "Mines Star",
    description: "Obtained from the treasure chest on floor 100 in The Mines.",
  },
  CF_Sewer: {
    title: "Krobus Star",
    description: "Can be purchased from Krobus for 20,000g in The Sewers.",
  },
  CF_Spouse: {
    title: "Spouse Star",
    description:
      "Obtained from spouse after reaching a friendship level of 12.5 hearts.",
  },
  CF_Statue: {
    title: "Secret Woods Star",
    description:
      "Obtained from Old Master Cannoli in the Secret Woods after giving him a Sweet Gem Berry.",
  },
  museumComplete: {
    title: "Museum Star",
    description: "Reward for donating all 95 items to the Museum.",
  },
};

const Farmer: NextPage = () => {
  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);

  const [name] = useKV<string>("general", "name", "Farmer");
  const [farmInfo] = useKV<string>("general", "farmInfo", "No farm info");
  const [timePlayed] = useKV<string>("general", "timePlayed", "0h 0m");
  const [moneyEarned] = useKV<number>("general", "moneyEarned", 0);
  const [farmerLevel] = useKV<number>("levels", "player", 0);
  const [questsCompleted] = useKV<number>("general", "questsCompleted", 0);
  const [stardropsCount, setStarCount] = useKV<number>("stardrops", "count", 0);

  const [maxLevelCount] = useKV<number>("levels", "maxLevelCount", 0);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
            {hasUploaded && (
              <div>
                <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                  Farmer Information
                </div>
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                  <div className="col-span-2 xl:col-span-1">
                    <InfoCard
                      title={"Player Name"}
                      Icon={UserIcon}
                      description={name}
                    />
                  </div>
                  <InfoCard
                    title="Farm Information"
                    description={farmInfo}
                    Icon={HomeIcon}
                  />
                  <InfoCard
                    title="Playtime"
                    Icon={ClockIcon}
                    description={timePlayed}
                  />
                  <InfoCard
                    title="Money Earned"
                    Icon={CurrencyDollarIcon}
                    description={`${moneyEarned.toLocaleString()}g`}
                  />
                  <InfoCard
                    title="Farmer Level"
                    Icon={ChartBarIcon}
                    description={`${farmerLevel}/25`}
                  />
                  <InfoCard
                    title="Quests Completed"
                    Icon={BriefcaseIcon}
                    description={`${questsCompleted}`}
                  />
                  <InfoCard
                    title="Stardrops Found"
                    Icon={StarIcon}
                    description={`${stardropsCount}`}
                  />
                </div>
              </div>
            )}
            {/* General Farmer Info */}
            {/* Money Stats */}
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Money
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {Object.values(achievements)
                  .filter((achievement) => achievement.id <= 4)
                  .map((achievement) => (
                    <AchievementCard
                      id={achievement.id}
                      tag={"achievements"}
                      key={achievement.id}
                      title={achievement.name}
                      description={achievement.description}
                      additionalDescription={
                        moneyEarned >= requirements[achievement.name]
                          ? ""
                          : ` - ${(
                              requirements[achievement.name] - moneyEarned
                            ).toLocaleString()}g left!`
                      }
                      sourceURL={achievement.iconURL}
                      initialChecked={
                        moneyEarned >= requirements[achievement.name]
                      }
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
              <div className="mt-4 grid grid-cols-2 gap-4 gap-y-2 lg:grid-cols-3 xl:grid-cols-5">
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
                {Object.values(achievements)
                  .filter((achievement) => achievement.category === "skills")
                  .map((achievement) => (
                    <AchievementCard
                      id={achievement.id}
                      tag={"achievements"}
                      key={achievement.id}
                      title={achievement.name}
                      description={achievement.description}
                      additionalDescription={
                        maxLevelCount >= requirements[achievement.name]
                          ? ""
                          : ` - ${
                              requirements[achievement.name] - maxLevelCount
                            } left!`
                      }
                      sourceURL={achievement.iconURL}
                      initialChecked={
                        maxLevelCount >= requirements[achievement.name]
                      }
                    />
                  ))}
              </div>
            </div>
            {/* Skills Information */}
            {/* Quests Information */}
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Quests
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {Object.values(achievements)
                  .filter((achievement) => achievement.category === "quests")
                  .map((achievement) => (
                    <AchievementCard
                      id={achievement.id}
                      tag={"achievements"}
                      key={achievement.id}
                      title={achievement.name}
                      description={achievement.description}
                      additionalDescription={
                        questsCompleted >= requirements[achievement.name]
                          ? ""
                          : ` - ${
                              requirements[achievement.name] - questsCompleted
                            } left!`
                      }
                      sourceURL={achievement.iconURL}
                      initialChecked={
                        questsCompleted >= requirements[achievement.name]
                      }
                    />
                  ))}
              </div>
            </div>
            {/* Quests Information */}
            {/* Stardrop Information */}
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Stardrops
              </div>

              <div className="mt-4">
                <AchievementCard
                  id={34}
                  tag={"achievements"}
                  title={"Mystery Of The Stardrops"}
                  description={"Find every stardrop."}
                  additionalDescription={
                    stardropsCount >= 7 ? "" : ` - ${7 - stardropsCount} left!`
                  }
                  sourceURL={
                    "https://stardewvalleywiki.com/mediawiki/images/e/e0/Achievement_Mystery_Of_The_Stardrops.jpg"
                  }
                  initialChecked={
                    stardropsCount >= Object.keys(STARDROPS).length
                  }
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {Object.keys(STARDROPS).map((stardrop) => (
                  <AchievementCard
                    id={stardrop}
                    tag={"stardrops"}
                    key={stardrop}
                    size={24}
                    sourceURL={
                      "https://stardewvalleywiki.com/mediawiki/images/a/a5/Stardrop.png"
                    }
                    title={STARDROPS[stardrop as keyof typeof STARDROPS].title}
                    description={
                      STARDROPS[stardrop as keyof typeof STARDROPS].description
                    }
                    setCount={setStarCount}
                  />
                ))}
              </div>
            </div>
            {/* Stardrop Information */}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Farmer;
