import {
  ArchiveIcon,
  SparklesIcon,
  FireIcon,
  BeakerIcon,
} from "@heroicons/react/outline";
import type { NextPage } from "next";
import Head from "next/head";

const navigation = [
  { name: "Discord", href: "#", icon: ArchiveIcon },
  { name: "Twitter", href: "#", icon: SparklesIcon },
  { name: "GitHub", href: "#", icon: SparklesIcon },
];

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>stardew.app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen">
        <div className="m-auto">
          <div className="space-y-2">
            <h1 className="o text-center text-3xl font-semibold dark:text-white">
              stardew.app
            </h1>
            <h2 className="text-center text-lg dark:text-white">
              A next generation, user-friendly Stardew Valley perfection
              tracker.
            </h2>
            <h3 className="text-md text-center dark:text-gray-400">
              Developed by Jack LaFond and Clemente Solorio.
            </h3>
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
      </main>
    </div>
  );
};

export default Home;
