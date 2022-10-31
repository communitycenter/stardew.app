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

import Notification from "./notification";
import LoginModal from "./modals/login";
import DesktopNav from "./desktopnav";
import MobileNav from "./mobilenav";

import { parseSaveFile } from "../utils/file";
import { Dialog, Transition } from "@headlessui/react";
import Popup from "./popup";

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
export type NavItem = typeof navigation[0];

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
          >
            <div className="py-6">{children}</div>
          </motion.div>
        </AnimatePresence>
      </DesktopNav>

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
