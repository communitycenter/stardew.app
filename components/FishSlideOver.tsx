import { Fragment, Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, CheckIcon } from "@heroicons/react/outline";

import Image from "next/image";

import type { Fish } from "../types";

type Props = {
  isOpen: boolean;
  selectedFish: Fish;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

// iterate through a list and return a comma separated string
const printLocations = (locations: string[]) => {
  return locations.join(", ");
};

const FishSlideOver = ({ isOpen, selectedFish, setOpen }: Props) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-end">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Fish Content */}
                      <div>
                        {/* Header with Image */}
                        <div className="flex justify-center">
                          <div>
                            <div className="flex justify-center">
                              <Image
                                src={selectedFish.iconUrl}
                                alt={selectedFish.name}
                                width={80}
                                height={80}
                                quality={100}
                              />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">
                              {selectedFish.name}
                            </h3>
                          </div>
                        </div>
                        {/* End Header with Image */}
                      </div>

                      {/* Fish Information Section */}
                      <div className="mt-8 space-y-8">
                        <div>
                          <h4 className="text-lg font-semibold">Location</h4>
                          <p className="mt-1">
                            {printLocations(selectedFish.location)}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">Time</h4>
                          <p className="mt-1">{selectedFish.time}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">Season</h4>
                          <p className="mt-1">
                            {printLocations(selectedFish.season)}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">Weather</h4>
                          <p className="mt-1">{selectedFish.weather}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">Difficulty</h4>
                          <p className="mt-1">{selectedFish.difficulty}</p>
                        </div>

                        {/* Mark as Caught Button */}
                        <button
                          // "absolute inset-x-0 bottom-0" is used to position the button at the bottom of the screen, but
                          // it gets rid of the padding on the left and right and becomes scrollable when you try and add it to the button.
                          className="flex w-full items-center space-x-3 rounded-lg border border-gray-300 bg-[#f7f7f7] py-5 px-3 hover:bg-gray-200"
                          onClick={() => setOpen(false)}
                          // TODO: when you mark as caught, set the local storage to a list of all marked fish?
                          // when you first render the page it would have to fetch from local storage to see what you've already caught
                        >
                          <CheckIcon className="h-6 w-6" aria-hidden="true" />
                          <p className="">Mark as caught</p>
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

export default FishSlideOver;
