import {
  Fragment,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useMemo,
  useEffect,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RiQuestionFill, RiFilePaper2Fill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";
import { IoIosArchive, IoMdCloseCircle } from "react-icons/io";
import {
  FaUserCircle,
  FaFish,
  FaHammer,
  FaFileImport,
  FaFileExport,
  FaGithub,
  FaDiscord,
} from "react-icons/fa";
import { BiImport, BiMenu, BiMessageSquareX } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import { GiCookingPot, GiIsland } from "react-icons/gi";
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
} from "../utils";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const navigation = [
  { name: "Farmer", href: "/farmer", icon: FaUserCircle },
  { name: "Bundles", href: "/bundles", icon: IoIosArchive },
  { name: "Fishing", href: "/fishing", icon: FaFish },
  { name: "Perfection", href: "#", icon: HiSparkles },
  { name: "Cooking", href: "#", icon: GiCookingPot },
  { name: "Crafting", href: "#", icon: FaHammer },
  { name: "Shipping", href: "#", icon: MdLocalShipping },
  { name: "Museum & Artifacts", href: "#", icon: MdMuseum },
  { name: "Secret Notes", href: "#", icon: RiFilePaper2Fill }, // Maybe put under Farmer tab?
  { name: "Ginger Island", href: "#", icon: GiIsland },
];

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

import { XMLParser } from "fast-xml-parser";
import Link from "next/link";
import Image from "next/image";
import { getCookie } from "cookies-next";

const SidebarLayout = ({
  children,
  activeTab,
  sidebarOpen,
  setSidebarOpen,
}: LayoutProps) => {
  // const user = useMemo(() => {
  //   try {
  //     const cookie = getCookie("discord_user");
  //     return cookie ? JSON.parse(cookie as string) : null;
  //   } catch (e) {
  //     return null;
  //   }
  // }, []);

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
    const file = event.target!.files![0];
    const reader = new FileReader();

    // We can check the progress of the upload with a couple events from the reader
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    // ex: reader.onloadstart, reader.onprogress, and finally reader.onload when its finished.

    reader.onload = async function (event) {
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

      console.log("Parsing information...");
      const { name, timePlayed, farmInfo } = parseGeneral(jsonObj);
      const moneyEarned = parseMoney(jsonObj);
      const { levels, maxLevelCount } = parseSkills(jsonObj);
      const questsCompleted = parseQuests(jsonObj);
      const { stardrops, stardropsCount } = parseStardrops(jsonObj);
      const { deepestMineLevel, deepestSkullCavernLevel, monstersKilled } =
        parseMonsters(jsonObj);
      const { houseUpgradeLevel, spouse, children } = parseFamily(jsonObj);
      const { fiveHeartCount, tenHeartCount, relationships } =
        parseSocial(jsonObj);
      const {
        allRecipesCount,
        cookedRecipesCount,
        knownRecipesCount,
        uncookedRecipes,
        unknownRecipes,
      } = parseCooking(jsonObj);
      const {
        fishCaught: allFish,
        totalFishCaught,
        uniqueCaught,
      } = parseFishing(jsonObj);
      console.log("Parsed information!");

      console.log("Uploading values to DB");
      // TODO: probably a cleaner way to do this with a filter or something.
      let fishCaught = {} as any;
      for (const fish_id in allFish) {
        if (allFish[fish_id] === true) {
          fishCaught[fish_id] = true;
        }
      }
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
            totalFishCaught,
            uniqueCaught,
            ...fishCaught,
          },
          mining: {
            deepestMineLevel,
            deepestSkullCavernLevel, // TODO: map through monstersKilled and add entry into DB for each
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
          cooking: {
            allRecipesCount,
            cookedRecipesCount,
            knownRecipesCount, // TODO: map through uncookedRecipes and unknownRecipes and add entry into DB for each
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
                      <IoMdCloseCircle
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
                        <FiUpload
                          className="h-5 w-5 text-black"
                          aria-hidden="true"
                        />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleFile(e)
                          }
                        />
                      </label>
                    </div>
                    {/* end file input section */}
                  </div>
                  <div className="mx-4 mt-4 border border-gray-200" />
                  <nav className="mt-4 space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link key="{item.name}" href={item.href}>
                        <a
                          className={classNames(
                            item.name === activeTab
                              ? "bg-gray-100 text-black"
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
                      </Link>
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
          <div className="soverflow-y-auto flex flex-1 flex-col pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center justify-between px-4">
              <h1 className="font-semibold dark:text-white">stardew.app</h1>
              {/* File Input, not sure how to process file yet but it lets you upload a file */}
              <div className="flex space-x-2">
                <Link href="https://discord.gg/YBNGCgCxG5">
                  <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7] p-1 text-white hover:bg-gray-200 dark:bg-[#141414] hover:dark:bg-[#1F1F1F]">
                    <FaDiscord
                      className="h-5 w-5 text-black dark:text-white"
                      aria-hidden="true"
                    />
                  </label>
                </Link>
                <Link href="https://github.com/stardewapp">
                  <label className="flex cursor-pointer flex-col items-center rounded-md bg-[#f7f7f7] p-1 text-white hover:bg-gray-200 dark:bg-[#141414] hover:dark:bg-[#1F1F1F]">
                    <FaGithub
                      className="h-5 w-5 text-black dark:text-white"
                      aria-hidden="true"
                    />
                  </label>
                </Link>
              </div>
              {/* end file input section */}
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
            <div className="mx-2 flex space-x-2">
              <div className="mt-4 flex-1 justify-end space-y-2 bg-white dark:bg-[#111111]">
                {!user ? (
                  <Link href="/api/oauth">
                    <a
                      className={classNames(
                        "border bg-gray-100 text-black dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white" +
                          "group flex items-center rounded-md py-4 px-3 text-base font-medium"
                      )}
                    >
                      <FaUserCircle
                        className={classNames(
                          "mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
                        )}
                        aria-hidden="true"
                      />
                      <p className="dark:text-white">Login</p>
                    </a>
                  </Link>
                ) : (
                  <a
                    className={classNames(
                      "border bg-gray-100 text-black dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white" +
                        "group flex items-center rounded-md py-4 px-3 text-base font-medium"
                    )}
                  >
                    <Image
                      className={classNames(
                        "mr-3 h-5 w-5 flex-shrink-0 rounded-2xl text-black dark:text-white"
                      )}
                      aria-hidden="true"
                      src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`}
                      alt="User avatar"
                      height={24}
                      width={24}
                    />
                    <p className="ml-2 dark:text-white">{user.discord_name}</p>
                  </a>
                )}
              </div>
              <div className="mt-4 flex justify-center bg-white dark:bg-[#111111]">
                <a
                  className={classNames(
                    "border bg-gray-100 text-black dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white" +
                      "group flex items-center rounded-md py-4  px-5 text-base font-medium"
                  )}
                >
                  <BiImport
                    className={classNames(
                      "h-5 w-5 flex-shrink-0 text-black dark:text-white"
                    )}
                    aria-hidden="true"
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFile(e)
                      }
                    ></input>
                  </BiImport>
                </a>
              </div>
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
          <div className="py-6">{children}</div>
        </main>
      </div>
    </>
  );
};

export default SidebarLayout;
