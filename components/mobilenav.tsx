import type { NavItem } from "./sidebarlayout";

import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, SetStateAction, Fragment } from "react";
import Link from "next/link";

import Popup from "./popup";
import { IoMdCloseCircle } from "react-icons/io";
import { FaDiscord, FaGithub } from "react-icons/fa";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface MobileNavProps {
  navigation: NavItem[];
  activeTab: string;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  user: {
    discord_name: string;
    discord_id: string;
    discord_avatar: string;
  } | null;
}

const MobileNav = ({
  navigation,
  activeTab,
  sidebarOpen,
  setSidebarOpen,
  setShowLoginModal,
  user,
}: MobileNavProps) => {
  return (
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
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-[#111111]">
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
                    <IoMdCloseCircle
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex h-0 flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center justify-between px-4">
                  <h1 className="text-lg font-semibold dark:text-white">
                    stardew.app
                  </h1>
                  {/* Icons & Inputs */}

                  <div className="flex space-x-2">
                    {/* Github Icon */}
                    <a href="https://github.com/communitycenter/stardew.app">
                      <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7] p-1 text-white hover:bg-gray-200 dark:bg-[#1f1f1f] hover:dark:bg-[#2a2a2a]">
                        <FaGithub
                          className="h-5 w-5 text-black dark:text-white"
                          aria-hidden="true"
                        />
                      </label>
                    </a>
                    {/* End Github Icon */}

                    {/* Discord Icon */}
                    <a href="https://discord.gg/NkgNVZwQ2M">
                      <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7] p-1 text-white hover:bg-gray-200 dark:bg-[#1f1f1f] hover:dark:bg-[#2a2a2a]">
                        <FaDiscord
                          className="h-5 w-5 text-black dark:text-white"
                          aria-hidden="true"
                        />
                      </label>
                    </a>
                    {/* End Discord Icon */}
                  </div>
                  {/* End Icons & Inputs Section */}
                </div>
                <div className="mx-4 mt-4 border border-gray-200" />
                <nav className="mt-4 flex-1 space-y-1 bg-white px-2 dark:bg-[#111111]">
                  {navigation.map((item) => (
                    <Link key="{item.name}" href={item.href}>
                      <a
                        className={classNames(
                          item.name === activeTab
                            ? "border bg-gray-100 text-black dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white"
                            : "text-[#7D7D7D] hover:bg-gray-50  dark:hover:bg-[#1F1F1F]",
                          "group flex items-center rounded-md py-4 px-5 text-base font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.name === activeTab
                              ? "mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
                              : "mr-3 h-5 w-5 flex-shrink-0 text-[#7D7D7D] "
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </nav>
                <div className="mx-2 flex items-center space-x-2 text-white">
                  {!user ? (
                    <div
                      onClick={() => {
                        setShowLoginModal(true);
                        setSidebarOpen(false);
                      }}
                      className="group flex w-full items-center rounded-md border bg-gray-100 py-4 px-5 text-base font-medium text-black hover:cursor-pointer dark:border-[#2a2a2a] dark:bg-[#1f1f1f] dark:text-white hover:dark:bg-[#191919]"
                    >
                      <FaDiscord
                        className={classNames(
                          "mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
                        )}
                        aria-hidden="true"
                      />
                      <p className="dark:text-white">Login with Discord</p>
                    </div>
                  ) : (
                    <Popup user={user} />
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0"></div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileNav;
