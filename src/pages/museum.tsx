import Head from "next/head";

import achievements from "@/data/achievements.json";
import { Separator } from "@/components/ui/separator";
import { FilterButton } from "@/components/filter-btn";
import museum from "@/data/artifacts.json";
import { BooleanCard } from "@/components/cards/boolean-card";
import { FishType, TrinketItem } from "@/types/items";
import { useState } from "react";
import { MuseumSheet } from "@/components/sheets/museum-sheet";
import { AchievementCard } from "@/components/cards/achievement-card";

export default function Museum() {
  const [open, setIsOpen] = useState(false);
  const [museumArtifact, setMuseumArtifact] = useState<TrinketItem | null>(
    null
  );

  const [_filter, setFilter] = useState("all");

  const [museumArtifactCollected, setMuseumArtifactCollected] = useState<
    Set<number>
  >(new Set());

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (name === "Treasure Trove") {
      completed = museumArtifactCollected.size >= 40;
      if (!completed) {
        additionalDescription = ` - ${40 - museumArtifactCollected.size} more`;
      }
    } else {
      completed = museumArtifactCollected.size >= 95;
      if (!completed) {
        additionalDescription = ` - ${95 - museumArtifactCollected.size} more`;
      }
    }

    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Museum</title>
        <meta
          name="description"
          content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley museum tracker, stardew valley artifacts, stardew valley minerals, stardew valley fossils, stardew valley museum collection, stardew valley curator, stardew valley 100% completion, stardew valley completionist, stardew valley hidden treasures, stardew valley mysteries, stardew valley past, stardew valley perfection tracker, stardew valley, stardew, stardew museum, stardew valley collectibles, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 py-2 px-8 justify-center items-center`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Museum Tracker
          </h1>
          {/* Achievements Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Achievements
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((a) => a.description.includes("museum"))
                .map((achievement) => {
                  const { completed, additionalDescription } =
                    getAchievementProgress(achievement.name);

                  return (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      completed={completed}
                      additionalDescription={additionalDescription}
                    />
                  );
                })}
            </div>
          </section>
          {/* Artifacts Section */}
          <Separator />
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              All Artifacts
            </h2>
            <div className="flex space-x-4">
              <FilterButton
                target={"0"}
                _filter={_filter}
                title="Not Donated"
                setFilter={setFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_filter}
                title="Donated"
                setFilter={setFilter}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(museum.artifacts)
                .filter((f) => {
                  if (_filter === "0") {
                    return !museumArtifactCollected.has(parseInt(f.itemID)); // incompleted
                  } else if (_filter === "2") {
                    return museumArtifactCollected.has(parseInt(f.itemID)); // completed
                  } else return true; // all
                })
                .map((f) => (
                  <BooleanCard
                    key={f.itemID}
                    item={f}
                    completed={museumArtifactCollected.has(parseInt(f.itemID))}
                    setIsOpen={setIsOpen}
                    setObject={setMuseumArtifact}
                  />
                ))}
            </div>
          </section>
          {/* Minerals Section */}
          <Separator />
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              All Minerals
            </h2>
            <div className="flex space-x-4">
              <FilterButton
                target={"0"}
                _filter={_filter}
                title="Not Donated"
                setFilter={setFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_filter}
                title="Donated"
                setFilter={setFilter}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(museum.minerals)
                .filter((f) => {
                  if (_filter === "0") {
                    return !museumArtifactCollected.has(parseInt(f.itemID)); // incompleted
                  } else if (_filter === "2") {
                    return museumArtifactCollected.has(parseInt(f.itemID)); // completed
                  } else return true; // all
                })
                .map((f) => (
                  <BooleanCard
                    key={f.itemID}
                    item={f as TrinketItem}
                    completed={museumArtifactCollected.has(parseInt(f.itemID))}
                    setIsOpen={setIsOpen}
                    setObject={setMuseumArtifact}
                  />
                ))}
            </div>
          </section>
        </div>
        <MuseumSheet
          open={open}
          setIsOpen={setIsOpen}
          trinket={museumArtifact}
        />
      </main>
    </>
  );
}
