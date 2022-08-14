import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import Head from "next/head";

import {
  ArchiveIcon,
  FilterIcon,
  SparklesIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import logo from "../public/icon.png";
import { FaDiscord } from "react-icons/fa";

const navigation = [
  { name: "Login with Discord", href: "#", icon: FaDiscord },
  { name: "Upload Stardew Save File", href: "#", icon: SparklesIcon },
];

const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>stardew.app</title>
      </Head>
      <SidebarLayout
        activeTab="Home"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex h-screen max-w-2xl">
          <div className="m-auto space-y-4">
            <div className="flex justify-center">
              <Image
                src={logo}
                height={64}
                width={64}
                alt="Heart emoji"
              ></Image>
            </div>
            <div className="space-yCleanShot 2022-08-14 at 16.11.50@2x.png-2 justify-center text-center text-gray-900 dark:text-white">
              <div className="text-2xl font-semibold ">
                Welcome to Stardew.app!{" "}
                <Image
                  src="https://stardewvalleywiki.com/mediawiki/images/c/c8/Emojis043.png"
                  height={24}
                  width={24}
                  alt="Heart emoji"
                ></Image>
              </div>
              <div className="space-y-2">
                <h2>
                  Get started by heading to the sidebar and checking off what
                  you've done - you can also upload your save file below and
                  have it automatically import data.
                </h2>
                <h2>
                  You can also login with Discord to save your data across
                  devices.
                </h2>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-x-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="
                  relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white"
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Home;
