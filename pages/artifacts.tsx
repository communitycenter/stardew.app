import type { NextPage } from "next";
import type { Fish } from "../types";

import achievements from "../research/processors/data/achievements.json";
import artifacts from "../research/processors/data/museum.json";

import FishCard from "../components/fishing/fishcard";
import AchievementCard from "../components/achievementcard";
import InfoCard from "../components/infocard";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import { useKV } from "../hooks/useKV";
import { InformationCircleIcon } from "@heroicons/react/solid";

const Artifacts: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [totalArtifactsFound, setTotalArtifactsFound] = useKV(
    "artifact",
    "totalArtifactsFound",
    0
  );
  const [totalMineralsFound, totalMineralsFoundFound] = useKV(
    "mineral",
    "totalMineralsFound",
    0
  );

  const [name] = useKV("general", "name", "Farmer");

  return (
    <>
      <Head>
        <title>stardew.app | Artifacts</title>
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
            {/* <InfoCard
              title={`${name} has caught 123 total fish and has caught 123/67 fish types.`}
              Icon={InformationCircleIcon}
              description={""}
            /> 
            
            I hate this info card.

            */}
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
                  />
                ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Artifacts
          </h2>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(artifacts.artifacts).map(([id, artifact]) => (
              <AchievementCard
                key={artifact.name}
                description={artifact.description}
                title={artifact.name}
                sourceURL={artifact.iconURL}
                id={id}
                tag="artifact"
              />
            ))}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Minerals
          </h2>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(artifacts.minerals).map(([id, mineral]) => (
              <AchievementCard
                key={mineral.name}
                description={mineral.description}
                title={mineral.name}
                sourceURL={mineral.iconURL}
                id={id}
                tag="mineral"
              />
            ))}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Artifacts;
