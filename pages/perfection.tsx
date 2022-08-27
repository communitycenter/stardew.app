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
import { AnimatePresence, motion } from "framer-motion";

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

  const [showGinger, setShowGinger] = useState<boolean>(false);
  const [showMonsters, setShowMonsters] = useState<boolean>(false);

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
              <div className="mb-2 mt-4 ml-1 text-2xl text-gray-900 dark:text-white md:text-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                    Monsters & Mining
                  </div>
                  <button
                    onClick={() => setShowMonsters(!showMonsters)}
                    className="flex items-center rounded-2xl border border-gray-300 bg-[#f0f0f0] p-1 dark:border-[#2A2A2A] dark:bg-[#191919] hover:dark:bg-[#f0f0f0]/10"
                  >
                    <div>
                      <motion.div
                        className="rounded-full"
                        animate={{ rotate: showMonsters ? 90 : 0 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                    </div>
                    {/* <p className="text-sm dark:text-white">
                      {showMonsters ? "Hide" : "Show"}
                    </p> */}
                  </button>
                </div>
              </div>
              <AnimatePresence initial={showMonsters}>
                {showMonsters && (
                  <motion.div
                    initial={{ opacity: 0, y: -25, animation: "fadeIn" }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.2 },
                    }}
                    exit={{ opacity: 0, y: -25, transition: { duration: 0.2 } }}
                    className="mt-4 grid gap-4 xl:grid-cols-5"
                    layout
                  >
                    {Object.entries(monsters).map(([monster, monsterInfo]) => (
                      <MonsterCard
                        key={monster}
                        monsterInfo={monsterInfo}
                        monsterCategory={monster}
                        setSelectedMonster={setSelectedMonster}
                        setShowMonster={setShowMonster}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl text-gray-900 dark:text-white md:text-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                    Ginger Island
                  </div>
                  <button
                    onClick={() => setShowGinger(!showGinger)}
                    className="flex items-center rounded-2xl border border-gray-300 bg-[#f0f0f0] p-1 dark:border-[#2A2A2A] dark:bg-[#191919] hover:dark:bg-[#f0f0f0]/10"
                  >
                    <div>
                      <motion.div
                        className="rounded-full"
                        animate={{ rotate: showGinger ? 90 : 0 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                    </div>
                    {/* <p className="text-sm dark:text-white">
                      {showMonsters ? "Hide" : "Show"}
                    </p> */}
                  </button>
                </div>
              </div>
              <AnimatePresence initial={showGinger}>
                {showGinger && (
                  <motion.div
                    initial={{ opacity: 0, y: -50, animation: "fadeIn" }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{
                      opacity: 0,
                      y: -25,
                      transition: { duration: 0.2 },
                    }}
                    className="mt-4 grid gap-4 xl:grid-cols-5"
                  >
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
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
