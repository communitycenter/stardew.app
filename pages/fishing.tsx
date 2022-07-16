import type { NextPage } from "next";
import type { Fish } from "../types";

import fishes from "../research/processors/fish.json";

import FishCard from "../components/FishCard";
import FishSlideOver from "../components/FishSlideOver";
import Head from "next/head";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import {
  ArchiveIcon,
  SparklesIcon,
  FireIcon,
  BeakerIcon,
  MenuIcon,
  XIcon,
  UploadIcon,
} from "@heroicons/react/solid";
import { useLocalStorageState } from "../hooks/use-local-storage";

const navigation = [
  { name: "Bundles", href: "#", icon: ArchiveIcon, current: false },
  { name: "Fishing", href: "#", icon: SparklesIcon, current: true },
  { name: "Perfection", href: "#", icon: SparklesIcon, current: false },
  { name: "Cooking", href: "#", icon: FireIcon, current: false },
  { name: "Crafting", href: "#", icon: BeakerIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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
      <div>
        <Head>
          <title>stardew.app | Fishing</title>
        </Head>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center justify-between px-4">
                      <h1 className="text-lg font-semibold">stardew.app</h1>
                      {/* File Input, not sure how to process file yet but it lets you upload a file */}
                      <div>
                        <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7] p-1 text-white hover:bg-gray-200">
                          <UploadIcon
                            className="h-5 w-5 text-black"
                            aria-hidden="true"
                          />
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                      {/* end file input section */}
                    </div>
                    <div className="mx-4 mt-4 border border-gray-200" />
                    <nav className="mt-4 space-y-1 px-2">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-100 text-sky-500"
                              : "text-black hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center rounded-md py-4 px-5 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={"mr-3 h-7 w-7 flex-shrink-0 text-black"}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0"></div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop sidebar */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-[#2a2a2a] dark:bg-[#111111]">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center justify-between px-4">
                <h1 className="font-semibold dark:text-white">stardew.app</h1>
                {/* File Input, not sure how to process file yet but it lets you upload a file */}
                <div>
                  <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7]  p-1 text-white hover:bg-gray-200 ">
                    <UploadIcon
                      className="h-5 w-5 text-black"
                      aria-hidden="true"
                    />
                    <input type="file" className="hidden" />
                  </label>
                </div>
                {/* end file input section */}
              </div>
              <div className="mx-4 mt-4 border border-gray-200 dark:border-[#2a2a2a]" />
              <nav className="mt-4 flex-1 space-y-2 bg-white px-2 dark:bg-[#111111] ">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "border bg-gray-100 text-sky-500 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white"
                        : "text-[#7D7D7D] hover:bg-gray-50  dark:hover:bg-[#1F1F1F]",
                      "group flex items-center rounded-md py-4 px-5 text-base font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
                          : "mr-3 h-5 w-5 flex-shrink-0 text-[#7D7D7D] "
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col dark:bg-[#141414] md:pl-64">
          <div className="sticky top-0 z-10 pl-1 pt-1   sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  All Fish
                </h1>
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
            </div>
          </main>
        </div>
      </div>

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
