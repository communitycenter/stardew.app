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
import { useKV } from "../hooks/useKV";

const Perfection: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);

  if (hasUploaded) {
    return (
      <>
        <Head>
          <title>stardew.app | Construction</title>
          <meta name="description" content="The homepage for Stardew.app." />
        </Head>
        <SidebarLayout
          activeTab=""
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        >
          <div className="mx-auto flex h-screen max-w-2xl">
            <div className="m-auto space-y-4">
              <div className="justify-center space-y-2 text-center text-gray-900 dark:text-white">
                <div className="space-y-2">
                  <h2>
                    Uh oh! You&apos;ve found a page that is currently under
                    construction.{" Give us a bit to finish this <3"}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>stardew.app | Construction</title>
          <meta name="description" content="The homepage for Stardew.app." />
        </Head>
        <SidebarLayout
          activeTab=""
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        >
          <div className="mx-auto flex h-screen max-w-2xl">
            <div className="m-auto space-y-4">
              <div className="justify-center space-y-2 text-center text-gray-900 dark:text-white">
                <div className="space-y-2">
                  <h2>
                    You&apos;ll need to upload a save file before you can use
                    this page!
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </>
    );
  }
};

export default Perfection;
