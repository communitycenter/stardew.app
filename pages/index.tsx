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

function classNames(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [completionTime, setCompletedTime] = useState<string>("0.00");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const onFilesDrop = React.useCallback((file: File) => {
    setFile(file);
    console.log("Dropped File", file.name);
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
              <div
                className={classNames("dragAndDropWrapper", {
                  dragAndDropActive: isDropActive,
                })}
              >
                <DragAndDrop
                  onDragStateChange={onDragStateChange}
                  onFilesDrop={onFilesDrop}
                >
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
                </DragAndDrop>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-x-2">
              {!user && (
                <a
                  className="
                  relative flex items-center space-x-3 rounded-lg border border-solid border-gray-300 bg-white py-4 px-5 hover:cursor-pointer hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F] dark:text-white"
                >
                  <Link key="Discord" href="/api/oauth">
                    <span className="flex">
                      <FaDiscord
                        className="mr-3 h-5 w-5 flex-shrink-0 text-black dark:text-white"
                        aria-hidden="true"
                      />
                      Login to Discord
                    </span>
                  </Link>
                </a>
              )}
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
