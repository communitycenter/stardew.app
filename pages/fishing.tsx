import type { NextPage } from "next";
import type { Fish } from "../types";

import fishes from "../research/processors/fish.json";

import FishCard from "../components/fishing/fishcard";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import { useLocalStorageState } from "../hooks/use-local-storage";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import FishSlideOver from "../components/fishing/fishslideover";

const initialCheckedFish = Object.fromEntries(
  Object.values(fishes).map((fish) => {
    return [fish.itemID, null];
  })
) as Record<number, boolean | null>;

const Fishing: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showFish, setShowFish] = useState<boolean>(false);
  const [selectedFish, setSelectedFish] = useState<Fish>(
    Object.values(fishes)[0]
  );
  const [checkedFish, setCheckedFish] = useLocalStorageState(
    "fish",
    initialCheckedFish
  );

  return (
    <>
      <Head>
        <title>stardew.app | Fishing</title>
      </Head>
      <SidebarLayout
        activeTab="Fishing"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            All Fish
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
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.values(fishes).map((fish) => (
              <FishCard
                key={fish.itemID}
                fish={fish}
                setSelectedFish={setSelectedFish}
                setShowFish={setShowFish}
                checked={checkedFish[fish.itemID]}
                setChecked={(value) => {
                  setCheckedFish((old) => {
                    return {
                      ...old,
                      [fish.itemID]:
                        value instanceof Function
                          ? value(old[fish.itemID])
                          : value,
                    };
                  });
                }}
              />
            ))}
          </div>
        </div>
      </SidebarLayout>

      <FishSlideOver
        isOpen={showFish}
        selectedFish={selectedFish}
        setOpen={setShowFish}
        checked={checkedFish[selectedFish.itemID]}
        setChecked={(value) => {
          setCheckedFish((old) => {
            return {
              ...old,
              [selectedFish.itemID]:
                value instanceof Function
                  ? value(old[selectedFish.itemID])
                  : value,
            };
          });
        }}
      />
    </>
  );
};

export default Fishing;
