import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import Head from "next/head";

import achievements from "../research/processors/data/achievements.json";
import walnuts from "../research/processors/data/walnuts.json";

import {
  ArchiveIcon,
  FilterIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import logo from "../public/icon.png";
import { FaBook, FaDiscord, FaSkull, FaTree } from "react-icons/fa";
import { useKV } from "../hooks/useKV";
import InfoCard from "../components/cards/infocard";
import {
  GiDeathSkull,
  GiIsland,
  GiMineWagon,
  GiMining,
  GiPaper,
  GiPapers,
} from "react-icons/gi";
import BooleanCard from "../components/cards/booleancard";
import AchievementCard from "../components/cards/achievementcard";

import monsters from "../research/processors/data/monsters.json";
import MonsterCard from "../components/cards/monstercard";
import MonsterSlideOver from "../components/slideovers/monsterslideover";
import { motion } from "framer-motion";

const Perfection: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);
  const [secretNotesFound] = useKV<number>("general", "secretNotesFound", 0);

  const [candles] = useKV<number>("perfection", "candles", 0);
  const [hasVisitedIsland] = useKV<boolean>(
    "perfection",
    "hasVisitedIsland",
    false
  );

  const [goldenWalnutsCalculated] = useKV<number>(
    "gingerIsland",
    "goldenWalnutsCalculated",
    0
  );

  const [journalScrapsFound] = useKV<number>(
    "gingerIsland",
    "journalScrapsFound",
    0
  );

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
        <title>stardew.app | Perfection</title>
        <meta name="description" content="The homepage for Stardew.app." />
      </Head>
      <SidebarLayout
        activeTab="Perfection"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Perfection
          </h1>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {/* <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Farmer Information
              </div> */}
              <InfoCard
                title="Deepest Mining Level"
                description={deepestMiningLevel.toString()}
                Icon={GiMineWagon}
              />
              <InfoCard
                title="Deepest Skull Cavern Level"
                description={deepestSkullCavernLevel.toString()}
                Icon={GiDeathSkull}
              />
              <InfoCard
                title="Secret Notes Found"
                description={secretNotesFound.toString()}
                Icon={GiPapers}
              />
              {!hasVisitedIsland ? (
                <>
                  <InfoCard
                    title="Golden Walnuts Found"
                    description={goldenWalnutsCalculated.toString() + "/130"}
                    Icon={FaTree}
                  />
                  <InfoCard
                    title="Journal Scraps Found"
                    description={journalScrapsFound.toString() + "/11"}
                    Icon={FaBook}
                  />
                </>
              ) : (
                <>
                  <InfoCard
                    title="Has Visited Ginger Island"
                    description="No"
                    Icon={GiIsland}
                  />
                </>
              )}
            </div>
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Monsters & Mining
              </div>
              <div className="mt-4 grid gap-4 xl:grid-cols-5">
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
        </div>

        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <h2 className="my-2 text-lg font-semibold text-gray-900 dark:text-white">
            Ginger Island
          </h2>
          {/* <div className="mt-2 grid grid-cols-2 gap-4">
            <Ac
              title="Deepest Mining Level"
              description={deepestMiningLevel.toString()}
              Icon={GiMining}
            />
            <InfoCard
              title="Deepest Skull Mining Level"
              description={deepestSkullCavernLevel.toString()}
              Icon={GiMining}
            />
          </div> */}

          <motion.div layout className="">
            <div>
              <h2 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                Golden Walnuts
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(walnuts).map(([id, walnut]) => (
                  <AchievementCard
                    key={id}
                    title={walnut.name}
                    tag="gingerIsland"
                    id={id}
                    description={walnut.hint}
                    sourceURL={
                      "https://stardewvalleywiki.com/mediawiki/images/5/54/Golden_Walnut.png"
                    }
                    initialChecked={walnut}
                  />
                ))}
              </div>
            </div>
          </motion.div>
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
