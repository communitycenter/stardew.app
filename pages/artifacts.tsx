import type { NextPage } from "next";

import achievements from "../research/processors/data/achievements.json";
import artifacts from "../research/processors/data/museum.json";

import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import ExpandableCard from "../components/cards/expandablecard";
import FilterBtn from "../components/filterbtn";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import { useKV } from "../hooks/useKV";
import { useCategory } from "../utils/useCategory";
import Head from "next/head";

import { InformationCircleIcon } from "@heroicons/react/solid";

const Artifacts: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [_Afilter, setAFilter] = useState<string>("off");
  const [_Mfilter, setMFilter] = useState<string>("off");

  const { data: archData, isLoading: archLoading } = useCategory(
    "artifacts",
    "boolean"
  );

  const { data: minData, isLoading: minLoading } = useCategory(
    "minerals",
    "boolean"
  );

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
          name="og:description"
          content="Track your Stardew Valley artifacts and museum progress. See what items you have left to donate for 100% completion on Stardew Valley."
        />
        <meta
          name="twitter:description"
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

          {/* ARTIFACTS */}
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {_Afilter === "off"
              ? "Artifacts"
              : { true: "Donated Artifact", false: "Unfound Artifact" }[
                  _Afilter
                ]}
          </h2>
          <div className="mt-2 flex items-center space-x-4">
            <FilterBtn
              _filter={_Afilter}
              setFilter={setAFilter}
              targetState="true"
              title="Donated Artifact"
            />
            <FilterBtn
              _filter={_Afilter}
              setFilter={setAFilter}
              targetState="false"
              title="Unfound Artifact"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {archLoading
              ? Object.entries(artifacts.artifacts).map(([, artifact]) => (
                  <ExpandableCard
                    key={artifact.itemID}
                    itemObject={artifact}
                    category="artifacts"
                    setCount={setTotalArtifactsFound}
                  />
                ))
              : Object.keys(archData)
                  .filter((key) => {
                    if (_Afilter === "off") return true;
                    else return archData[key] === JSON.parse(_Afilter);
                  })
                  .map((artifactID: string) => (
                    <ExpandableCard
                      key={artifactID}
                      itemObject={
                        artifacts.artifacts[
                          artifactID as keyof typeof artifacts.artifacts
                        ]
                      }
                      category="artifacts"
                      setCount={setTotalArtifactsFound}
                    />
                  ))}
          </div>
          {/* END ARTIFACTS */}

          {/* MINERALS */}
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {_Mfilter === "off"
              ? "Minerals"
              : { true: "Donated Artifact", false: "Unfound Artifact" }[
                  _Mfilter
                ]}
          </h2>
          <div className="mt-2 flex items-center space-x-4">
            <FilterBtn
              _filter={_Mfilter}
              setFilter={setMFilter}
              targetState="true"
              title="Donated Mineral"
            />
            <FilterBtn
              _filter={_Mfilter}
              setFilter={setMFilter}
              targetState="false"
              title="Unfound Mineral"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {minLoading
              ? Object.entries(artifacts.minerals).map(([, mineral]) => (
                  <ExpandableCard
                    key={mineral.itemID}
                    itemObject={mineral}
                    category="minerals"
                    setCount={setTotalArtifactsFound}
                  />
                ))
              : Object.keys(minData)
                  .filter((key) => {
                    if (_Mfilter === "off") return true;
                    else return minData[key] === JSON.parse(_Mfilter);
                  })
                  .map((mineralID: string) => (
                    <ExpandableCard
                      key={mineralID}
                      itemObject={
                        artifacts.minerals[
                          mineralID as keyof typeof artifacts.minerals
                        ]
                      }
                      category="minerals"
                      setCount={setTotalMineralsFound}
                    />
                  ))}
          </div>
          {/* END MINERALS */}
        </div>
      </SidebarLayout>
    </>
  );
};

export default Artifacts;
