import { BooleanCard } from "@/components/cards/boolean-card";
import { DialogCard } from "@/components/cards/dialog-card";
import { Construction } from "@/components/construction";
import walnuts from "@/data/walnuts.json";
import { WalnutType } from "@/types/items";

import { Inter } from "next/font/google";
import Head from "next/head";
import { SetStateAction } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function IslandWalnuts() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="og:description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="twitter:description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="keywords"
          content="stardew valley Golden Walnut tracker, stardew valley Golden Walnuts, stardew valley Golden Walnut locations, stardew valley Golden Walnut rewards, stardew valley Golden Walnut collection, stardew valley gameplay tracker, stardew valley, stardew, Golden Walnut tracker"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className} py-2 px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Golden Walnut Tracker
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.values(walnuts).map((walnut) => {
              return (
                <DialogCard
                  key={walnut.name}
                  title={`${walnut.name} ${
                    walnut.num > 1 ? `(${walnut.num}x)` : ""
                  }`}
                  description={walnut.description}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/5/54/Golden_Walnut.png"
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
