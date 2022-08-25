import {
  Fragment,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { getCookie } from "cookies-next";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { Dialog, Menu, Transition } from "@headlessui/react";
import { HiSparkles } from "react-icons/hi";
import { IoIosArchive, IoMdCloseCircle } from "react-icons/io";
import {
  FaUserCircle,
  FaFish,
  FaHammer,
  FaGithub,
  FaDiscord,
  FaHouseUser,
  FaUser,
  FaPeopleCarry,
  FaHeartbeat,
  FaHeart,
} from "react-icons/fa";
import { BiImport, BiMenu } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import { GiCookingPot, GiThreeFriends } from "react-icons/gi";
import { MdLocalShipping, MdMuseum } from "react-icons/md";

import {
  parseMoney,
  parseGeneral,
  parseSkills,
  parseQuests,
  parseStardrops,
  parseMonsters,
  parseFamily,
  parseSocial,
  parseCooking,
  parseFishing,
  parseCrafting,
  parseMuseum,
} from "../utils";

import Notification from "./notification";
import Popup from "./popup";

import { XMLParser } from "fast-xml-parser";
import * as Popover from "@radix-ui/react-popover";
import LoginModal from "./modals/login";
import Example from "./popup";
import CreditsModal from "./modals/credits";
import { parseSaveFile } from "../utils/file";

const semVerGte = require("semver/functions/gte");

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const navigation = [
  { name: "Home", href: "/", icon: FaHouseUser },
  { name: "Farmer", href: "/farmer", icon: FaUserCircle },
  { name: "Fishing", href: "/fishing", icon: FaFish },
  { name: "Perfection", href: "/construction", icon: HiSparkles },
  { name: "Cooking", href: "/cooking", icon: GiCookingPot },
  { name: "Crafting", href: "/crafting", icon: FaHammer },
  { name: "Shipping", href: "/shipping", icon: MdLocalShipping },
  { name: "Family & Social", href: "/social", icon: FaHeart },
  { name: "Museum & Artifacts", href: "/artifacts", icon: MdMuseum },
  { name: "Bundles", href: "/bundles", icon: IoIosArchive },
];

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const SidebarLayout = ({
  children,
  activeTab,
  sidebarOpen,
  setSidebarOpen,
}: LayoutProps) => {
  const [showNotification, setShowNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showLoginSlideover, setShowLoginSlideover] = useState<boolean>(false);

  const [errorMSG, setErrorMSG] = useState("");
  const [completionTime, setCompletedTime] = useState<string>("0.00");

  const [user, setUser] = useState<{
    discord_name: string;
    discord_id: string;
    discord_avatar: string;
  } | null>(null);
  useEffect(() => {
    try {
      const cookie = getCookie("discord_user");
      if (!cookie) setUser(null);
      setUser(JSON.parse(cookie as string));
    } catch (e) {
      setUser(null);
    }
  }, []);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    // https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react
    setShowNotification(false);
    setShowErrorNotification(false);
    const file = event.target!.files![0];
    if (typeof file === "undefined") return;

    // just a check to see if the file name has the format <string>_<id> and make sure it doesn't have an extension since SDV saves don't have one.
    if (!/[a-zA-Z0-9]+_[0-9]+/.test(file.name) || file.type !== "") {
      setErrorMSG(
        "Invalid File Uploaded. Please upload a Stardew Valley save file."
      );
      setShowErrorNotification(true);
      return;
    }
    const reader = new FileReader();

    // We can check the progress of the upload with a couple events from the reader
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    // ex: reader.onloadstart, reader.onprogress, and finally reader.onload when its finished.

    reader.onload = async function (event) {
      try {
        const { success, timeTaken } = await parseSaveFile(
          event.target?.result
        );
        if (success) {
          setShowNotification(true);
          setCompletedTime(timeTaken);
        }
      } catch (e) {
        setErrorMSG(e as string);
        setShowErrorNotification(true);
      }
    };

    reader.readAsText(file!);
  }

  return (
    <>
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
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center justify-between px-4">
                    <h1 className="text-lg font-semibold dark:text-white">
                      stardew.app
                    </h1>
                    {/* Icons & Inputs */}

                    <div className="flex space-x-2">
                      {/* Github Icon */}
                      <a href="https://github.com/stardewapp">
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
                          setShowLoginSlideover(true);
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

      {/* Desktop sidebar */}
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
                  onClick={() => setShowLoginSlideover(true)}
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
        <div className="sticky top-0 z-10 pl-1 pt-1   sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <BiMenu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1">
          <AnimatePresence>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-6">{children}</div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Notification
        title="Successfully uploaded save file!"
        description={`Completed in ${completionTime} seconds!`}
        success={true}
        show={showNotification}
        setShow={setShowNotification}
      />
      <Notification
        title="Error Parsing Data"
        description={errorMSG}
        success={false}
        show={showErrorNotification}
        setShow={setShowErrorNotification}
      />
      <LoginModal isOpen={showLoginSlideover} setOpen={setShowLoginSlideover} />
    </>
  );
};

export default SidebarLayout;
