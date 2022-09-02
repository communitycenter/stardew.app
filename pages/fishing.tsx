import type { NextPage } from "next";
import type { Fish } from "../types";

import fishes from "../research/processors/data/fish.json";
import achievements from "../research/processors/data/achievements.json";

import BooleanCard from "../components/cards/booleancard";
import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import SidebarLayout from "../components/sidebarlayout";
import FishSlideOver from "../components/slideovers/fishslideover";

import { useEffect, useState } from "react";
import { useKV } from "../hooks/useKV";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { useCategory } from "../utils/useCategory";

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  Fisherman: 10,
  "Ol' Mariner": 24,
  "Master Angler": 67,
};

const Fishing: NextPage = () => {
  const { data, error, isLoading } = useCategory("fish", "boolean");

  const [_filter, setFilter] = useState<string>("off");

  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);

  const [name] = useKV<string>("general", "name", "Farmer");
  const [totalCaught] = useKV<number>("fish", "totalCaught", 0);
  const [uniqueCaught, setUniqueCaught] = useKV<number>(
    "fish",
    "uniqueCaught",
    0
  );

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showFish, setShowFish] = useState<boolean>(false);
  const [selectedFish, setSelectedFish] = useState<Fish>(
    Object.values(fishes)[0]
  );

  return (
    <>
      <Head>
        <title>stardew.app | Fishing</title>
        <meta
          name="description"
          content="Track your Stardew Valley fishing progress. See what fish you need to catch for 100% completion on Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your Stardew Valley fishing progress. See what fish you need to catch for 100% completion on Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your Stardew Valley fishing progress. See what fish you need to catch for 100% completion on Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley fishing tracker, stardew valley, stardew, stardew checkup, stardew fishing, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <SidebarLayout
        activeTab="Fishing"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Fishing
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
            {hasUploaded && (
              <InfoCard
                title={`${name} has caught ${totalCaught} total fish and has caught ${uniqueCaught}/67 fish types.`}
                Icon={InformationCircleIcon}
              />
            )}
            <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "fishing")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    additionalDescription={
                      achievement.name === "Mother Catch"
                        ? totalCaught >= 100
                          ? ""
                          : ` - ${100 - totalCaught} left!`
                        : uniqueCaught >= requirements[achievement.name]
                        ? ""
                        : ` - ${
                            requirements[achievement.name] - uniqueCaught
                          } left!`
                    }
                    sourceURL={achievement.iconURL}
                    initialChecked={
                      achievement.name === "Mother Catch"
                        ? totalCaught >= 100
                        : uniqueCaught >= requirements[achievement.name]
                    }
                  />
                ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            All Fish
          </h2>
          <div className="flex items-center space-x-4">
            <div className="mt-2">
              <div
                onClick={() =>
                  setFilter((prev) => (prev === "true" ? "off" : "true"))
                }
                className={
                  "flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 hover:cursor-pointer dark:border-[#2A2A2A] dark:bg-[#191919] hover:dark:border-gray-400" +
                  (_filter === "true" ? " bg-[#e0e0e0] dark:bg-[#2A2A2A]" : "")
                }
              >
                <div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20" />
                <p className="text-sm dark:text-white">Caught Fish</p>
              </div>
            </div>
            <div className="mt-2">
              <div
                onClick={() =>
                  setFilter((prev) => (prev === "false" ? "off" : "false"))
                }
                className={
                  "flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 hover:cursor-pointer dark:border-[#2A2A2A] dark:bg-[#191919] hover:dark:border-gray-400" +
                  (_filter === "false" ? " bg-[#e0e0e0] dark:bg-[#2A2A2A]" : "")
                }
              >
                <div className="h-4 w-4 rounded-full border border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]" />
                <p className="text-sm dark:text-white">Uncaught Fish</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Object.values(fishes).map((fish) => (
                  <BooleanCard
                    key={fish.itemID}
                    category="fish"
                    itemObject={fish}
                    setSelected={setSelectedFish}
                    setShow={setShowFish}
                    setCount={setUniqueCaught}
                  />
                ))
              : Object.keys(data)
                  .filter((key) => {
                    if (_filter === "off") {
                      return data[key] === true || data[key] === false;
                    } else {
                      return data[key] === JSON.parse(_filter);
                    }
                  })
                  .map((fishID) => (
                    <BooleanCard
                      key={fishID}
                      category="fish"
                      itemObject={fishes[fishID as keyof typeof fishes]}
                      setSelected={setSelectedFish}
                      setShow={setShowFish}
                      setCount={setUniqueCaught}
                    />
                  ))}
            {/* {Object.values(fishes).map((fish) => (
              <BooleanCard
                key={fish.itemID}
                category="fish"
                itemObject={fish}
                setSelected={setSelectedFish}
                setShow={setShowFish}
                setCount={setUniqueCaught}
              />
            ))} */}
          </div>
        </div>
      </SidebarLayout>

      <FishSlideOver
        isOpen={showFish}
        selectedFish={selectedFish}
        setOpen={setShowFish}
        setCount={setUniqueCaught}
      />
    </>
  );
};

export default Fishing;
