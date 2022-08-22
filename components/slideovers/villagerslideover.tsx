import objects from "../../research/processors/data/objects.json";

import { Fragment, Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, CheckIcon } from "@heroicons/react/outline";
import { useKV } from "../../hooks/useKV";

import Image from "next/image";
import ItemDisplay from "./itemDisplay";
import { ExclamationIcon } from "@heroicons/react/solid";

type Props = {
  isOpen: boolean;
  selected: any; // a Villager
  setOpen: Dispatch<SetStateAction<boolean>>;
  setFiveCount: Dispatch<SetStateAction<number>>;
  setTenCount: Dispatch<SetStateAction<number>>;
};

// TODO: find categories -260 (maru) ????
const categoryItems: Record<string, string> = {
  "-2": "All Gems*",
  "-4": "Any Fish",
  "-5": "Any Egg",
  "-6": "Any Milk",
  "-7": "All Cooking",
  "-12": "All Minerals",
  "-15": "All Metal Resources",
  "-26": "All Artisan Goods",
  "-27": "All Syrups",
  "-75": "All Vegetables",
  "-79": "All Fruits",
  "-80": "All Flowers",
  "-81": "All Foragables",
  "-260": "???",
  "-777": "Wild Seeds (Any)",
};

const categoryIcons: Record<string, string> = {
  "-2": "https://stardewvalleywiki.com/mediawiki/images/e/ea/Diamond.png",
  "-4": "https://stardewvalleywiki.com/mediawiki/images/0/04/Sardine.png",
  "-5": "https://stardewvalleywiki.com/mediawiki/images/2/26/Egg.png",
  "-6": "https://stardewvalleywiki.com/mediawiki/images/9/92/Milk.png",
  "-7": "https://stardewvalleywiki.com/mediawiki/images/6/6b/Pancakes.png",
  "-12": "https://stardewvalleywiki.com/mediawiki/images/3/3c/Opal.png",
  "-15": "https://stardewvalleywiki.com/mediawiki/images/e/e9/Iridium_Ore.png",
  "-26": "https://stardewvalleywiki.com/mediawiki/images/6/69/Wine.png",
  "-27": "https://stardewvalleywiki.com/mediawiki/images/6/6a/Maple_Syrup.png",
  "-75": "https://stardewvalleywiki.com/mediawiki/images/8/8f/Eggplant.png",
  "-79": "https://stardewvalleywiki.com/mediawiki/images/1/19/Melon.png",
  "-80": "https://stardewvalleywiki.com/mediawiki/images/8/81/Sunflower.png",
  "-81": "https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png",
  "-260":
    "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png",
  "-777":
    "https://stardewvalleywiki.com/mediawiki/images/3/39/Spring_Seeds.png",
};

function findItem(itemId: number): any {
  if (itemId > 0) {
    const findItem = Object.entries(objects).find(
      ([id, _]) => id === itemId.toString()
    );
    if (!findItem) return;
    return findItem[1];
  } else {
    return {
      name: categoryItems[itemId],
      iconURL: categoryIcons[itemId],
    };
  }
}

const VillagerSlideOver = ({
  isOpen,
  selected,
  setOpen,
  setFiveCount,
  setTenCount,
}: Props) => {
  const [value, setValue] = useKV<number>(
    "social",
    selected.name.toString(),
    0
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
                      {/* Villager Content */}
                      {/* Header with Image */}
                      <div>
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
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* End Header with Image */}

                      {/* Information Section */}
                      <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-semibold">Birthday</h4>
                            <p className="mt-1 dark:text-gray-400">
                              {selected.birthday}
                            </p>
                          </div>

                          {/* GIFTS LOVED */}
                          <div>
                            <h4 className="text-lg font-semibold">
                              Loved Gifts
                            </h4>
                            <div className="mt-1 grid grid-cols-2 gap-y-2 dark:text-gray-400">
                              {selected.loves.map((itemID: number) => {
                                return (
                                  <ItemDisplay
                                    itemID={itemID}
                                    item={findItem(itemID)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          {/* END GIFTS LOVED */}

                          {/* GIFTS LIKED */}
                          <div>
                            <h4 className="text-lg font-semibold">
                              Liked Gifts
                            </h4>
                            <div className="mt-1 grid grid-cols-2 gap-y-2 dark:text-gray-400">
                              {selected.likes.map((itemID: number) => {
                                return (
                                  <ItemDisplay
                                    itemID={itemID}
                                    item={findItem(itemID)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          {/* END GIFTS LIKED */}

                          {/* GIFTS DISLIKED */}
                          <div>
                            <h4 className="text-lg font-semibold">
                              Disliked Gifts
                            </h4>
                            <div className="mt-1 grid grid-cols-2 gap-y-2 dark:text-gray-400">
                              {selected.dislikes.map((itemID: number) => {
                                return (
                                  <ItemDisplay
                                    itemID={itemID}
                                    item={findItem(itemID)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          {/* END GIFTS DISLIKED */}

                          {/* GIFTS HATED */}
                          <div>
                            <h4 className="text-lg font-semibold">
                              Hated Gifts
                            </h4>
                            <div className="mt-1 grid grid-cols-2 gap-y-2 dark:text-gray-400">
                              {selected.hates.map((itemID: number) => {
                                return (
                                  <ItemDisplay
                                    itemID={itemID}
                                    item={findItem(itemID)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          {/* END GIFTS HATED */}
                        </div>

                        {/* RESET HEARTS BTN */}
                        <button
                          className="light:hover:bg-gray-200 flex w-full items-center space-x-3 rounded-lg border border-gray-300 bg-[#f7f7f7] py-5 px-3 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white dark:hover:bg-[#191919]"
                          onClick={() => {
                            if (value !== 0) setValue(0);
                            setOpen(false);
                          }}
                        >
                          <ExclamationIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                          <p className="">Reset Hearts to 0</p>
                        </button>
                      </div>
                      {/* End Information Section */}

                      {/*End Villager Content */}
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

export default VillagerSlideOver;
