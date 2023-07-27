import Head from "next/head";

import type { FishType } from "@/types/items";

import fishes from "@/data/fish.json";
import objects from "@/data/objects.json";
import achievements from "@/data/achievements.json";

import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { FishSheet } from "@/components/sheets/fish-sheet";
import { BooleanCard } from "@/components/cards/boolean-card";
import { AchievementCard } from "@/components/cards/achievement-card";

export default function Fishing() {
  const [open, setIsOpen] = useState(false);
  const [fish, setFish] = useState<FishType | null>(null);

  return (
    <>
      <Head>
        <title>stardew.app | Fishing Tracker</title>
        <meta
          name="description"
          content="Track your Stardew Valley fishing progress and optimize your angling skills. Monitor your catch count, rare fish, and tackle usage to become a master angler. Discover the best fishing spots, seasons, and weather conditions for each fish. Take your fishing game to the next level and aim for 100% completion in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your Stardew Valley fishing progress and optimize your angling skills. Monitor your catch count, rare fish, and tackle usage to become a master angler. Discover the best fishing spots, seasons, and weather conditions for each fish. Take your fishing game to the next level and aim for 100% completion in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your Stardew Valley fishing progress and optimize your angling skills. Monitor your catch count, rare fish, and tackle usage to become a master angler. Discover the best fishing spots, seasons, and weather conditions for each fish. Take your fishing game to the next level and aim for 100% completion in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley fishing tracker, stardew valley fish tracker, stardew valley fishing progress, stardew valley angler, stardew valley fishing spots, stardew valley fish checklist, stardew valley rare fish, stardew valley fishing seasons, stardew valley tackle usage, stardew valley fishing guide, stardew valley 100% completion, stardew valley perfection tracker, stardew valley, stardew, stardew fishing, stardew valley fish, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 py-2 px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Fishing Tracker
          </h1>
          {/* Achievements Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {Object.values(achievements)
                .filter((a) => a.description.includes("fish"))
                .map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    id={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
                    completed={false}
                  />
                ))}
            </div>
          </section>
          {/* All Fish Section */}
          <Separator />
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              All Fish
            </h2>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {Object.values(fishes).map((f) => (
                <BooleanCard
                  key={f.itemID}
                  fish={f as FishType}
                  completed={false}
                  setIsOpen={setIsOpen}
                  setObject={setFish}
                />
              ))}
            </div>
          </section>
        </div>
        <FishSheet open={open} setIsOpen={setIsOpen} fish={fish} />
      </main>
    </>
  );
}
