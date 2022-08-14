import type { CookingRecipe } from "../../types/cookingRecipes";

import cooking_recipes from "../../research/processors/data/cooking_recipes.json";
import objects from "../../research/processors/data/objects.json";

import { Fragment, Dispatch, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, CheckIcon } from "@heroicons/react/outline";
import { useKV } from "../../hooks/useKV";

import Image from "next/image";

type Props = {
  isOpen: boolean;
  selected: CookingRecipe;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const RecipeSlideOver = ({ isOpen, selected, setOpen }: Props) => {
  const [checked, setChecked] = useKV(
    "cooking",
    selected.itemID.toString(),
    false
  );

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-250"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity dark:bg-[#0C0C0C] dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-250 sm:duration-250"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-250 sm:duration-250"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl dark:bg-[#141414]">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-end">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-[#141414]"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 dark:text-white sm:px-6">
                      {/* Cooking Content */}
                      <div>
                        {/* Header with Image */}
                        <div className="flex justify-center">
                          <div>
                            <div className="flex justify-center">
                              <Image
                                src={selected.iconURL}
                                alt={selected.name}
                                width={80}
                                height={80}
                                quality={100}
                              />
                            </div>
                            <div className="text-center">
                              <h3 className="mt-6 text-xl font-semibold">
                                {selected.name}
                              </h3>
                              <h4 className="italic dark:text-gray-400">
                                {selected.description}
                              </h4>
                            </div>
                          </div>
                        </div>
                        {/* End Header with Image */}
                      </div>

                      {/* Information Section */}
                      <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold">
                              Unlock Conditions
                            </h4>
                            <p className="mt-1 dark:text-gray-400">
                              {selected.unlockConditions}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">
                              Ingredients Needed
                            </h4>
                            <p className="mt-1 dark:text-gray-400">
                              {selected.ingredients.map((ingredient) => {
                                const findItem = Object.entries(objects).find(
                                  ([id, obj]) =>
                                    id === ingredient.itemID.toString()
                                );
                                let item;
                                if (findItem) {
                                  item = findItem[1];
                                } else {
                                  item = {
                                    name: "Unknown",
                                    iconURL:
                                      "https://stardewvalleywiki.com/mediawiki/images/9/94/Emojis131.png",
                                  };
                                }
                                return (
                                  <div key={ingredient.itemID}>
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0">
                                        <Image
                                          src={item.iconURL}
                                          alt={item.name}
                                          width={32}
                                          height={32}
                                          quality={100}
                                        />
                                      </div>
                                      <div className="ml-2 mb-2">
                                        <div className="text-sm font-semibold">
                                          {ingredient.amount}x {item!.name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Mark as Complete Button */}
                        <button
                          className="light:hover:bg-gray-200 flex w-full items-center space-x-3 rounded-lg border border-gray-300 bg-[#f7f7f7] py-5 px-3 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white dark:hover:bg-[#191919]"
                          onClick={() => {
                            setChecked((old) => !old);
                            setOpen(false);
                          }}
                        >
                          {!checked ? (
                            <CheckIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                          <p className="">
                            Mark as {checked ? "un" : null}cooked
                          </p>
                        </button>
                      </div>
                      {/* End Fish Info Section */}

                      {/* End Fish Content */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default RecipeSlideOver;
