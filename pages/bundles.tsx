import { FilterIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import BundleCard from "../components/bundles/bundleCard";
import SidebarLayout from "../components/sidebarlayout";
import { useLocalStorageState } from "../hooks/use-local-storage";

import bundles from "../research/processors/data/bundles.json";
import {
  Bundle,
  BundleItem,
  communityCenter,
  CommunityCenterRoom,
} from "../types/bundles";

const Bundles: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Object.entries(communityCenter).map(([roomName, room]) => {
  //   const roomItems = Object.entries(room).map(([itemName, item]) => {
  //     const { itemsRequired, bundleReward } = item;
  //     return {
  //       roomName,
  //       itemName,
  //       itemsRequired,
  //       bundleReward,
  //     };
  //   });
  //   return roomItems;
  // });

  return (
    <>
      <Head>
        <title>stardew.app | Bundles</title>
        <meta
          name="description"
          content="Track your Stardew Valley Community Center bundle progress. See what items you need for your bundles to attain 100% completion on Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your Stardew Valley Community Center bundle progress. See what items you need for your bundles to attain 100% completion on Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your Stardew Valley Community Center bundle progress. See what items you need for your bundles to attain 100% completion on Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley bundle tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <SidebarLayout
        activeTab="Bundles"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white md:text-2xl">
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
          <div className="grid grid-cols-1 gap-4 py-4">
            {Object.entries(communityCenter).map(([roomName, room]) => (
              <div key={roomName} className="space-y-2">
                <div className="mb-2 mt-4 ml-1 text-xl font-semibold text-gray-900 dark:text-white md:text-xl">
                  {roomName}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(room).map(([bundleName, bundle]) => {
                    return (
                      <BundleCard
                        key={`${roomName}-${bundleName}`}
                        bundleName={bundleName}
                        bundle={bundle}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Bundles;
