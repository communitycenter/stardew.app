import {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { getCookie } from "cookies-next";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { HiSparkles } from "react-icons/hi";
import { IoIosArchive } from "react-icons/io";
import {
  FaUserCircle,
  FaFish,
  FaHammer,
  FaGithub,
  FaDiscord,
  FaHouseUser,
  FaHeart,
} from "react-icons/fa";
import { BiMenu } from "react-icons/bi";
import { GiCookingPot } from "react-icons/gi";
import { MdLocalShipping, MdMuseum } from "react-icons/md";

import Notification from "./notification";
import LoginModal from "./modals/login";
import MobileNav from "./mobilenav";
import Popup from "./popup";

import { parseSaveFile } from "../utils/file";
import DesktopNav from "./desktopnav";

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

export type NavItem = typeof navigation[0];

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
