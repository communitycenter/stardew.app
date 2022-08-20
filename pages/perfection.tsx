import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import Head from "next/head";

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
            Perfection Tracking
          </h1>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Mining
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Monsters
            </div>
            <div className="grid grid-cols-5 gap-4">
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
