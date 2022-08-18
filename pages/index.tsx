import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import Head from "next/head";

import { useRef } from "react";

import {
  ArchiveIcon,
  FilterIcon,
  SparklesIcon,
  PlusIcon
} from "@heroicons/react/outline";
import Image from "next/image";
import logo from "../public/icon.png";
import { FaDiscord } from "react-icons/fa";

const navigation = [
  { name: "Login with Discord", href: "/api/oauth", icon: FaDiscord, class: "relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white" },
  { name: "Upload Stardew Save File", href: "#", icon: SparklesIcon, class: "block sm:hidden relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white" },
];


const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const onFileUpload = () => {
    inputFile.current?.click();
  };
  return (
    <>
      <Head>
        <title>stardew.app | Home</title>
        <meta name="description" content="The homepage for Stardew.app." />
      </Head>
      <SidebarLayout
        activeTab="Home"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex h-screen max-w-2xl px-4 sm:px-0">
          <div className="m-auto">
            <div className="flex justify-center">
              <Image
                src={logo}
                height={64}
                width={64}
                alt="Heart emoji"
              ></Image>
            </div>
            <div className="justify-center space-y-2 text-center text-gray-900 dark:text-white">
              <div className="text-2xl font-semibold ">
                Welcome to Stardew.app!{" "}
                  <Image
                    src="https://stardewvalleywiki.com/mediawiki/images/c/c8/Emojis043.png"
                    height={18}
                    width={18}
                    alt="Heart emoji"
                  ></Image>
              </div>
              <div className="pb-2">
                <h2>
                  Get started by heading to the sidebar and checking off what
                  you&apos;ve done - or upload your save file below
                  and automatically import your data.
                </h2>
                <h2 className="pt-2">
                  You can also login with Discord to save your data across
                  devices.
                </h2>
              </div>
              <input type="file" id="file" ref={inputFile} className="hidden" />
              <button
                onClick={onFileUpload}
                type="button"
                className="hidden sm:block relative w-2/3 mx-auto border-2 border-gray-300 border-dashed rounded-lg p-10 text-center hover:border-gray-400 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-none"
              >
                <PlusIcon className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">Upload Stardew Save File</span>
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-x-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={item.class}
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
