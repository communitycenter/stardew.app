import React from "react";
import type { NextPage } from "next";

import SidebarLayout from "../components/sidebarlayout";
import DragAndDrop from "../components/inputs/draganddrop";

import { useEffect, useState, ChangeEvent } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { PlusIcon } from "@heroicons/react/outline";
import { FaDiscord } from "react-icons/fa";

import logo from "../public/icon.png";
import { parseSaveFile } from "../utils/file";
import Notification from "../components/notification";
import { execPath } from "process";
import ExpandableCard from "../components/cards/expandablecard";
import BooleanCard from "../components/cards/booleancard";

function classNames(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

const akjsdh: any = {
  name: "Click me!",
  iconURL:
    "https://stardewvalleywiki.com/mediawiki/images/3/36/Emote_Exclamation.png",
  description: "You did one click! Now double click it to mark it as complete.",
  itemID: 1337,
};

const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [clem, setClem] = useState<number>(0);

  const [showNotification, setShowNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [completionTime, setCompletedTime] = useState<string>("0.00");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowNotification(false);
    setShowErrorNotification(false);
    // handling when the user clicks the upload box instead of drag
    e.preventDefault();

    // https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react
    // setShowNotification(false);
    // setShowErrorNotification(false);
    const file = e.target!.files![0];
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
        const { success, timeTaken, message } = await parseSaveFile(
          event.target?.result
        );
        if (success) {
          setShowNotification(true);
          setCompletedTime(timeTaken!);
        } else {
          setErrorMSG(message!);
          setShowErrorNotification(true);
        }
      } catch (e) {
        setErrorMSG(e as string);
        setShowErrorNotification(true);
      }
    };

    reader.readAsText(file!);
  };

  const [isDropActive, setIsDropActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const onDragStateChange = React.useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  const onFilesDrop = React.useCallback(async (file: File) => {
    setShowNotification(false);
    setShowErrorNotification(false);
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
        const { success, timeTaken, message } = await parseSaveFile(
          event.target?.result
        );
        if (success) {
          setShowNotification(true);
          setCompletedTime(timeTaken!);
        } else {
          setErrorMSG(message!);
          setShowErrorNotification(true);
        }
      } catch (e) {
        setErrorMSG(e as string);
        setShowErrorNotification(true);
      }
    };

    reader.readAsText(file!);
  }, []);

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
        <div className="px-8">
          <div className="grid gap-4">
            <div>
              <div className=" h-[33vh] items-center space-x-3 truncate rounded-lg border border-gray-300 bg-[#f0f0f0] py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div>
                  <div className="space-y-3">
                    <div>
                      <Image
                        src={logo}
                        width={64}
                        height={64}
                        alt="stardew.app"
                      />
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex h-[33vh] flex-col items-start rounded-lg border border-gray-300  py-4 px-5  dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="space-y-6">
                  <div className="justify-center text-xl font-semibold text-gray-900 dark:text-white">
                    How it works
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-normal text-gray-900 dark:text-white">
                      Click this card once to open it, and click it twice to
                      mark it as complete!
                    </p>
                    <ExpandableCard
                      itemObject={akjsdh}
                      category={"tutorial"}
                      setCount={setClem}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-normal text-gray-900 dark:text-white">
                      Click this card once to open it, and click it twice to
                      mark it as complete!
                    </p>
                    <ExpandableCard
                      itemObject={akjsdh}
                      category={"tutorial"}
                      setCount={setClem}
                    />
                  </div>
                </div>
              </div>
              <div className="h-[33vh] items-center space-x-3 truncate rounded-lg border border-gray-300  py-4 px-5 dark:border-[#2A2A2A] dark:bg-[#191919]"></div>
            </div>
            <div>
              <DragAndDrop
                onDragStateChange={onDragStateChange}
                onFilesDrop={onFilesDrop}
              >
                <div className="h-[25vh] items-center space-x-3 truncate rounded-lg border border-solid transition hover:border-sky-900 hover:bg-sky-800/20 dark:border-[#2A2A2A] dark:bg-[#191919]">
                  <label className="flex h-full w-full flex-grow items-center justify-center space-x-3">
                    <PlusIcon
                      className="h-10 w-10 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-sm text-gray-400 group-hover:text-gray-500">
                        Drag your Stardew Valley save here, or click to upload.
                      </p>
                      <br />

                      <p className="text-sm text-gray-400 group-hover:text-gray-500">
                        Need help finding your save? Saves usually look like
                        this: <code>Jack_0120902</code>
                      </p>
                      <p className="text-sm text-gray-400 group-hover:text-gray-500">
                        <span className="font-bold">Windows: </span>
                        %AppData%\StardewValley\Saves\
                      </p>
                      <p className="text-sm text-gray-400 group-hover:text-gray-500">
                        <span className="font-bold">macOS & Linux: </span>
                        ~/.config/StardewValley/Saves/
                      </p>
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e)
                      }
                    />
                  </label>
                </div>
              </DragAndDrop>
            </div>
          </div>
        </div>
      </SidebarLayout>
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
    </>
  );
};

export default Home;
