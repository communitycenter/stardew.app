import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";

import { ChangeEvent, useState } from "react";
import { useRef } from "react";
import Head from "next/head";
import Image from "next/image";

import { PlusIcon } from "@heroicons/react/outline";
import { FaDiscord } from "react-icons/fa";

import logo from "../public/icon.png";
import { FiUpload } from "react-icons/fi";

const navigation = [
  {
    name: "Login with Discord",
    href: "/api/oauth",
    icon: FaDiscord,
    class:
      "relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white",
  },
];

const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const inputFile = useRef<HTMLInputElement | null>(null);
  const onButtonClick = () => {
    inputFile.current!.click();
    console.log("clicked");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling change");
    e.preventDefault();
    const file = e.target?.files![0];

    console.log(file.name);
  };
  return (
    <>
      <Head>
        <title>stardew.app | Stardew Valley 100% completion tracker</title>
        <meta
          name="description"
          content="The homepage for stardew.app. Upload your Stardew Valley Save File to track your progress towards 100% completion. Login to track your perfection progress across multiple devices."
        />
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
              <div className="text-2xl font-semibold">
                Welcome to Stardew.app!{" "}
                <Image
                  src="https://stardewvalleywiki.com/mediawiki/images/c/c8/Emojis043.png"
                  height={18}
                  width={18}
                  alt="Heart emoji"
                ></Image>
              </div>
              <div className="pb-2 text-left">
                <h2>
                  Get started by heading to the sidebar and checking off what
                  you&apos;ve done - or upload your save file below and
                  automatically import your data. You can also find an upload
                  button at the bottom of the sidebar on the left.
                </h2>
                <h2 className="pt-2">
                  Additionally, you can login with Discord to save your data
                  across devices.
                </h2>
              </div>
              <div>
                <label className="group flex cursor-pointer flex-col items-center rounded-lg border-2 border-dotted border-gray-300 bg-transparent p-10 text-white hover:border-gray-400">
                  <PlusIcon
                    className="h-8 w-8 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-sm text-gray-400 group-hover:text-gray-500">
                    Upload Stardew Valley Save File
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(e)
                    }
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-x-2">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className={item.class}>
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
