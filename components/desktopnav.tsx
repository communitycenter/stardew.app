import type { NavItem } from "./sidebarlayout";

import Link from "next/link";

import { BiMenu } from "react-icons/bi";
import { FaDiscord, FaGithub } from "react-icons/fa";

import Popup from "./popup";
import { Dispatch, SetStateAction } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface DesktopProps {
  children: React.ReactNode;
  navigation: NavItem[];
  activeTab: string;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  user: {
    discord_name: string;
    discord_id: string;
    discord_avatar: string;
  } | null;
}

const DesktopNav = ({
  children,
  navigation,
  activeTab,
  setShowLoginModal,
  setSidebarOpen,
  user,
}: DesktopProps) => {
  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-[#2a2a2a] dark:bg-[#111111]">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center justify-between px-4">
              <h1 className="font-semibold dark:text-white">stardew.app</h1>
              {/* Sidebar Links Section */}
              <div className="flex space-x-2">
                <a href="https://discord.gg/NkgNVZwQ2M">
                  <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7] p-1 text-white hover:bg-gray-200 dark:bg-[#1f1f1f] hover:dark:bg-[#2a2a2a]">
                    <FaDiscord
                      className="h-5 w-5 text-black dark:text-white"
                      aria-hidden="true"
                    />
                  </label>
                </a>
                <a
                  href="https://github.com/stardewapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7] p-1 text-white hover:bg-gray-200 dark:bg-[#1f1f1f] hover:dark:bg-[#2a2a2a]">
                    <FaGithub
                      className="h-5 w-5 text-black dark:text-white"
                      aria-hidden="true"
                    />
                  </label>
                </a>
              </div>
              {/* End Sibdebar Links Section */}
            </div>
            <div className="mx-4 mt-4 border border-gray-200 dark:border-[#2a2a2a]" />
            <nav className="mt-4 flex-1 space-y-2 bg-white px-2 dark:bg-[#111111] ">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
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
                          : "mr-3 h-5 w-5 flex-shrink-0 text-[#7D7D7D]"
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
                  onClick={() => setShowLoginModal(true)}
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
        </div>
      </div>

      <div className="flex flex-1 flex-col dark:bg-[#141414] md:pl-64">
        <div className="sticky top-0 z-10 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <BiMenu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
};

export default DesktopNav;
