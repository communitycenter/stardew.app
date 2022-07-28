import { FilterIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import SidebarLayout from "../components/sidebarlayout";

import bundles from "../research/processors/bundles.json";
const Bundles: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  //   const [showFish, setShowFish] = useState<boolean>(false);
  //   const [selectedFish, setSelectedFish] = useState<Fish>(
  //     Object.values(fishes)[0]
  //   );
  //   const [checkedFish, setCheckedFish] = useLocalStorageState(
  //     "fish",
  //     initialCheckedFish
  //   );

  const bundlesData = Object.entries(bundles);
  console.log(bundlesData);

  return (
    <>
      <Head>
        <title>stardew.app | Bundles</title>
      </Head>
      <SidebarLayout
        activeTab="Bundles"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            All Bundles
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
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 ">
            {bundlesData.map(([room, bundles]) => {
              return (
                <div key={room}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {room}
                  </h2>
                  {bundles.map((bundle: any) => {})}
                </div>
              );
            })}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Bundles;
