import type { NextPage } from "next";

import achievements from "../research/processors/data/achievements.json";
import artifacts from "../research/processors/data/museum.json";

import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import { useKV } from "../hooks/useKV";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import { InformationCircleIcon } from "@heroicons/react/solid";

const Artifacts: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [totalArtifactsFound, setTotalArtifactsFound] = useKV(
    "museum",
    "artifactsDonated",
    0
  );
  const [totalMineralsFound, setTotalMineralsFound] = useKV(
    "museum",
    "mineralsDonated",
    0
  );

  const [name] = useKV("general", "name", "Farmer");

  return (
    <>
      <Head>
        <title>stardew.app | Artifacts</title>
        <meta
          name="description"
          content="Track your Stardew Valley artifacts and museum progress. See what items you have left to donate for 100% completion on Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley museum tracker, stardew valley artifact tracker, stardew valley artifacts, stardew valley museum, stardew valley prismatic shard, prismatic shard, stardew valley, stardew, stardew checkup, stardew museum, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <SidebarLayout
        activeTab="Museum & Artifacts"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Museum & Artifacts
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
            <InfoCard
              title={`${name} has donated ${totalArtifactsFound}/42 artifacts and ${totalMineralsFound}/53 minerals.`}
              Icon={InformationCircleIcon}
              description={""}
            />

            <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "museum")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
                    initialChecked={
                      achievement.name === "A Complete Collection"
                        ? totalMineralsFound + totalArtifactsFound === 95
                        : totalMineralsFound + totalArtifactsFound >= 40
                    }
                  />
                ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Artifacts
          </h2>
          <div className="flex items-center space-x-4">
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20" />
                <p className="text-sm dark:text-white">Donated Artifact</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]" />
                <p className="text-sm dark:text-white">Unfound Artifact</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(artifacts.artifacts).map(([, artifact]) => (
              <AchievementCard
                key={artifact.itemID}
                description={artifact.description}
                title={artifact.name}
                size={32}
                sourceURL={artifact.iconURL}
                id={artifact.itemID}
                tag="museum"
              />
            ))}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Minerals
          </h2>
          <div className="flex items-center space-x-4">
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20" />
                <p className="text-sm dark:text-white">Donated Mineral</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]" />
                <p className="text-sm dark:text-white">Unfound Mineral</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(artifacts.minerals).map(([, mineral]) => (
              <AchievementCard
                key={mineral.itemID}
                description={mineral.description}
                title={mineral.name}
                size={32}
                sourceURL={mineral.iconURL}
                id={mineral.itemID}
                tag="museum"
              />
            ))}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Artifacts;
