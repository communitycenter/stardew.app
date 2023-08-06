import Head from "next/head";

import achievements from "@/data/achievements.json";
import museum from "@/data/artifacts.json";

import { TrinketItem } from "@/types/items";
import { useContext, useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilterButton } from "@/components/filter-btn";
import { PlayersContext } from "@/contexts/players-context";
import { BooleanCard } from "@/components/cards/boolean-card";
import { MuseumSheet } from "@/components/sheets/museum-sheet";
import { AchievementCard } from "@/components/cards/achievement-card";

export default function Museum() {
  const [open, setIsOpen] = useState(false);
  const [museumArtifact, setMuseumArtifact] = useState<TrinketItem | null>(
    null
  );

  const [_artifactFilter, setArtifactFilter] = useState("all");
  const [_mineralFilter, setMineralFilter] = useState("all");

  const [museumArtifactCollected, setMuseumArtifactCollected] = useState<
    Set<number>
  >(new Set());

  const [museumMineralCollected, setMuseumMineralCollected] = useState<
    Set<number>
  >(new Set());

  const { activePlayer } = useContext(PlayersContext);

  useEffect(() => {
    if (activePlayer) {
      setMuseumArtifactCollected(new Set(activePlayer.museum.artifacts));
      setMuseumMineralCollected(new Set(activePlayer.museum.minerals));
    }
  }, [activePlayer]);

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (name === "Treasure Trove") {
      completed =
        museumArtifactCollected.size + museumMineralCollected.size >= 40;
      if (!completed) {
        additionalDescription = ` - ${
          40 - (museumArtifactCollected.size + museumMineralCollected.size)
        } more`;
      }
    } else {
      completed =
        museumArtifactCollected.size + museumMineralCollected.size >= 95;
      if (!completed) {
        additionalDescription = ` - ${
          95 - (museumArtifactCollected.size + museumMineralCollected.size)
        } more`;
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
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Museum Tracker
          </h1>
          {/* Achievements Section */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white pt-0">
                  Achievements
                </AccordionTrigger>
                <AccordionContent asChild>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Artifacts Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              All Artifacts
            </h2>
            <div className="flex space-x-4">
              <FilterButton
                target={"0"}
                _filter={_artifactFilter}
                title="Not Donated"
                setFilter={setArtifactFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_artifactFilter}
                title="Donated"
                setFilter={setArtifactFilter}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(museum.artifacts)
                .filter((f) => {
                  if (_artifactFilter === "0") {
                    return !museumArtifactCollected.has(parseInt(f.itemID)); // incompleted
                  } else if (_artifactFilter === "2") {
                    return museumArtifactCollected.has(parseInt(f.itemID)); // completed
                  } else return true; // all
                })
                .map((f) => (
                  <BooleanCard
                    key={`artifact-${f.itemID}`}
                    item={f}
                    completed={museumArtifactCollected.has(parseInt(f.itemID))}
                    setIsOpen={setIsOpen}
                    setObject={setMuseumArtifact}
                  />
                ))}
            </div>
          </section>
          {/* Minerals Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              All Minerals
            </h2>
            <div className="flex space-x-4">
              <FilterButton
                target={"0"}
                _filter={_mineralFilter}
                title="Not Donated"
                setFilter={setMineralFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_mineralFilter}
                title="Donated"
                setFilter={setMineralFilter}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(museum.minerals)
                .filter((f) => {
                  if (_mineralFilter === "0") {
                    return !museumMineralCollected.has(parseInt(f.itemID)); // incompleted
                  } else if (_mineralFilter === "2") {
                    return museumMineralCollected.has(parseInt(f.itemID)); // completed
                  } else return true; // all
                })
                .map((f) => (
                  <BooleanCard
                    key={`mineral-${f.itemID}`}
                    item={f as TrinketItem}
                    completed={museumMineralCollected.has(parseInt(f.itemID))}
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
