import {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useEffect,
  useState,
  Fragment,
} from "react";
import { getCookie } from "cookies-next";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { HiSparkles } from "react-icons/hi";
import { IoIosArchive, IoMdCloseCircle } from "react-icons/io";
import {
  FaUserCircle,
  FaFish,
  FaHammer,
  FaHouseUser,
  FaHeart,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import { GiCookingPot } from "react-icons/gi";
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
  parseShipping,
} from "../utils";

import Notification from "./notification";
import LoginModal from "./modals/login";
import DesktopNav from "./desktopnav";
import MobileNav from "./mobilenav";

import { parseSaveFile } from "../utils/file";
import { Dialog, Transition } from "@headlessui/react";
import Popup from "./popup";
import { XMLParser } from "fast-xml-parser";
const semVerGte = require("semver/functions/gte");

const navigation = [
  { name: "Home", href: "/", icon: FaHouseUser },
  { name: "Farmer", href: "/farmer", icon: FaUserCircle },
  { name: "Fishing", href: "/fishing", icon: FaFish },
  { name: "Perfection", href: "/perfection", icon: HiSparkles },
  { name: "Cooking", href: "/cooking", icon: GiCookingPot },
  { name: "Crafting", href: "/crafting", icon: FaHammer },
  { name: "Shipping", href: "/shipping", icon: MdLocalShipping },
  { name: "Family & Social", href: "/social", icon: FaHeart },
  { name: "Museum & Artifacts", href: "/artifacts", icon: MdMuseum },
  { name: "Bundles", href: "/bundles", icon: IoIosArchive },
];
export type NavItem = (typeof navigation)[0];

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SidebarLayout = ({
  children,
  activeTab,
  sidebarOpen,
  setSidebarOpen,
}: LayoutProps) => {
  const [showNotification, setShowNotification] = useState(false);
  const [showStartNotification, setShowStartNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

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
    setShowStartNotification(false);
    const file = event.target!.files![0];
    if (typeof file === "undefined") return;

    // just a check to see if the file name has the format <string>_<id> and make sure it doesn't have an extension since SDV saves don't have one.
    if (!/[a-zA-Z]+_[0-9]+/.test(file.name) || file.type !== "") {
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
      setShowStartNotification(true);
      // console.log(event.target?.result);
      console.log("Parsing XML...");
      const start = performance.now();
      const parser = new XMLParser({ ignoreAttributes: false });
      const jsonObj = parser.parse(event.target?.result as string);
      console.log(
        "Parsed XML in",
        (performance.now() - start).toFixed(3),
        "ms"
      );

      // check the version number of the SDV save file
      try {
        const gameVersion: string = jsonObj.SaveGame.gameVersion;

        // make sure the game version is at least 1.5.0
        // we can modify this later if we decide to support older versions of SDV
        if (!semVerGte(gameVersion, "1.5.0")) {
          setErrorMSG(
            "Please upload a save file from version 1.5.0 or newer. If you would like to request support for an older version, please contact us on Discord or open an issue on Github."
          );
          setShowErrorNotification(true);
          console.log("Exiting...");
          return;
        }
      } catch (e) {
        if (e instanceof TypeError) {
          setErrorMSG(
            "Invalid File Uploaded. Couldn't find Game Version, please upload a Stardew Valley save file."
          );
          setShowErrorNotification(true);
          console.log("Exiting...");
          return;
        }
      }
      console.log("Parsing information...");
      // General Information
      const { name, timePlayed, farmInfo } = parseGeneral(jsonObj);
      const moneyEarned = parseMoney(jsonObj);
      const { levels, maxLevelCount } = parseSkills(jsonObj);
      const questsCompleted = parseQuests(jsonObj);
      const { stardrops, stardropsCount } = parseStardrops(jsonObj);

      // Fishing
      const { allFish, totalCaught, uniqueCaught } = parseFishing(jsonObj);

      // Cooking
      const { cookedCount, knownCount, allRecipes } = parseCooking(jsonObj);
      // Crafting
      const {
        allRecipes: craftingRecipes,
        knownCount: knownCountCrafted,
        craftedCount: craftedCount,
      } = parseCrafting(jsonObj);

      // Family & social
      const { houseUpgradeLevel, spouse, children } = parseFamily(jsonObj);
      const { fiveHeartCount, tenHeartCount, relationships } =
        parseSocial(jsonObj);

      // Monsters
      const { deepestMineLevel, deepestSkullCavernLevel, monstersKilled } =
        parseMonsters(jsonObj);

      // Shipping
      const { itemsShipped, numItems } = parseShipping(jsonObj);

      console.log("Parsed information!");

      console.log("Uploading values to DB");
      const dbstart = performance.now();
      let response = await fetch("/api/kv", {
        method: "PATCH",
        body: JSON.stringify({
          general: {
            name,
            timePlayed,
            farmInfo,
            moneyEarned,
            questsCompleted,
            uploadedFile: true,
          },
          stardrops: {
            count: stardropsCount,
            CF_Fair: stardrops.CF_Fair,
            CF_Fish: stardrops.CF_Fish,
            CF_Mines: stardrops.CF_Mines,
            CF_Sewer: stardrops.CF_Sewer,
            CF_Spouse: stardrops.CF_Spouse,
            CF_Statue: stardrops.CF_Statue,
            museumComplete: stardrops.museumComplete,
          },
          levels: {
            player: levels["Player"],
            farming: levels["Farming"],
            fishing: levels["Fishing"],
            foraging: levels["Foraging"],
            mining: levels["Mining"],
            combat: levels["Combat"],
            maxLevelCount,
          },
          fish: {
            totalCaught,
            uniqueCaught,
            ...allFish,
          },
          cooking: {
            cookedCount,
            knownCount,
            ...allRecipes,
          },
          crafting: {
            craftedCount,
            knownCount: knownCountCrafted,
            ...craftingRecipes,
          },
          shipping: {
            numItems,
            ...itemsShipped,
          },
          mining: {
            deepestMineLevel,
            deepestSkullCavernLevel, // TODO: map through monstersKilled and add entry into DB for each
            ...monstersKilled,
          },
          family: {
            houseUpgradeLevel,
            spouse: spouse ? spouse : "No spouse",
            childrenLength: children ? children.length : 0,
          },
          social: {
            fiveHeartCount,
            tenHeartCount, // TODO: map through relationships and add entry into DB for each
          },
        }),
      });
      console.log(
        "Completed DB uploads in",
        (performance.now() - dbstart).toFixed(3),
        "ms"
      );

      const elapsed = performance.now() - start;
      console.log("Elapsed", elapsed.toFixed(3), "ms");
      setCompletedTime((elapsed / 1000).toFixed(2));
      setShowNotification(true);
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
                <div className="flex h-0 flex-1 flex-col overflow-y-auto pt-5 pb-4">
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

      <MobileNav
        activeTab={activeTab}
        navigation={navigation}
        setShowLoginModal={setShowLoginModal}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        user={user}
      />

      <DesktopNav
        activeTab={activeTab}
        navigation={navigation}
        setShowLoginModal={setShowLoginModal}
        setSidebarOpen={setSidebarOpen}
        user={user}
      >
        <AnimatePresence>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="py-6 h-full">{children}</div>
          </motion.div>
        </AnimatePresence>
      </DesktopNav>

      <Notification
        title="Starting save file processing..."
        description={`This might take a second!`}
        success={true}
        show={showStartNotification}
        setShow={setShowStartNotification}
      />
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
      <LoginModal isOpen={showLoginModal} setOpen={setShowLoginModal} />
    </>
  );
};

export default SidebarLayout;
