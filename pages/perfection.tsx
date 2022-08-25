import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import Head from "next/head";

import achievements from "../research/processors/data/achievements.json";

import {
  ArchiveIcon,
  FilterIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import logo from "../public/icon.png";
import { FaDiscord } from "react-icons/fa";
import { useKV } from "../hooks/useKV";
import InfoCard from "../components/cards/infocard";
import { GiMining } from "react-icons/gi";
import BooleanCard from "../components/cards/booleancard";
import AchievementCard from "../components/cards/achievementcard";

import monsters from "../research/processors/data/monsters.json";
import MonsterCard from "../components/cards/monstercard";
import MonsterSlideOver from "../components/slideovers/monsterslideover";

const Perfection: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);

  const [deepestMiningLevel] = useKV<number>("mining", "deepestMineLevel", 0);
  const [deepestSkullCavernLevel] = useKV<number>(
    "mining",
    "deepestSkullCavernLevel",
    0
  );

  const [showMonster, setShowMonster] = useState<boolean>(false);
  const [selectedMonster, setSelectedMonster] = useState<any>(
    Object.entries(monsters)[0]
  );
  return (
    <>
      <Head>
        <title>stardew.app | Construction</title>
        <meta name="description" content="The homepage for Stardew.app." />
      </Head>
      <SidebarLayout
        activeTab=""
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Perfection
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
              Mining & Monsters
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <InfoCard
                title="Deepest Mining Level"
                description={deepestMiningLevel.toString()}
                Icon={GiMining}
              />
              <InfoCard
                title="Deepest Skull Mining Level"
                description={deepestSkullCavernLevel.toString()}
                Icon={GiMining}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Mining
                </h2>
                <div className="mt-2">
                  {Object.values(achievements)
                    .filter((achievement) => achievement.name === "The Bottom")
                    .map((achievement) => (
                      <AchievementCard
                        id={achievement.id}
                        tag={"achievements"}
                        key={achievement.id}
                        title={achievement.name}
                        description={achievement.description}
                        sourceURL={achievement.iconURL}
                        initialChecked={deepestMiningLevel === 120}
                        additionalDescription={`- ${
                          120 - deepestMiningLevel
                        } levels left!`}
                      />
                    ))}
                </div>
              </div>
              <div>
                <h2 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Monsters
                </h2>
                <div className="mt-2">
                  {Object.values(achievements)
                    .filter(
                      (achievement) => achievement.category === "monsters"
                    )
                    .map((achievement) => (
                      <AchievementCard
                        id={achievement.id}
                        tag={"achievements"}
                        key={achievement.id}
                        title={achievement.name}
                        description={achievement.description}
                        sourceURL={achievement.iconURL}
                        // initialChecked={deepestMiningLevel === 120}
                        // additionalDescription={`- ${
                        //   120 - deepestMiningLevel
                        // } levels left!`}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-4">
            {Object.entries(monsters).map(([monster, monsterInfo]) => (
              <MonsterCard
                key={monster}
                monsterInfo={monsterInfo}
                monsterCategory={monster}
                setSelectedMonster={setSelectedMonster}
                setShowMonster={setShowMonster}
              />
            ))}
          </div>
        </div>
      </SidebarLayout>

      <MonsterSlideOver
        isOpen={showMonster}
        selected={selectedMonster}
        setOpen={setShowMonster}
      />
    </>
  );
};

export default Perfection;
