import { FilterIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import FishCard from "../components/FishCard";
import FishSlideOver from "../components/FishSlideOver";
import SidebarLayout from "../components/sidebarlayout";

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
            <div className="relative space-y-2 rounded-lg bg-white py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
              <div className="text-gray-900 dark:text-white">Vault</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
                      alt="wtf"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Gold
                    </p>
                    <p className="truncate text-sm text-gray-400">2,500g</p>
                  </div>
                </div>
                <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
                      alt="wtf"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Gold
                    </p>
                    <p className="truncate text-sm text-gray-400">5,000g</p>
                  </div>
                </div>
                <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
                      alt="wtf"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Gold
                    </p>
                    <p className="truncate text-sm text-gray-400">10,000g</p>
                  </div>
                </div>
                <div className="relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://stardewvalleywiki.com/mediawiki/images/1/10/Gold.png"
                      alt="wtf"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Gold
                    </p>
                    <p className="truncate text-sm text-gray-400">25,000g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Bundles;
