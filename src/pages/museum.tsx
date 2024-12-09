import Head from "next/head";

import achievements from "@/data/achievements.json";
import museum from "@/data/museum.json";

import { MuseumItem } from "@/types/items";
import { useState, useMemo } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { BooleanCard } from "@/components/cards/boolean-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { FilterButton } from "@/components/filter-btn";
import { MuseumSheet } from "@/components/sheets/museum-sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";

const reqs: Record<string, number> = {
  "A Complete Collection": Object.values(museum).flatMap((item) =>
    Object.values(item),
  ).length,
  "Treasure Trove": 40,
};

export default function Museum() {
  const [open, setIsOpen] = useState(false);
  const [museumArtifact, setMuseumArtifact] = useState<MuseumItem | null>(null);

  const [_artifactFilter, setArtifactFilter] = useState("all");
  const [_mineralFilter, setMineralFilter] = useState("all");

  const { activePlayer } = usePlayers();
  const { show, toggleShow } = usePreferences();

  // unblur dialog
  const [showPrompt, setPromptOpen] = useState(false);

  const [museumArtifactCollected, museumMineralCollected] = useMemo(
    () => [
      new Set<string>(activePlayer?.museum?.artifacts ?? []),
      new Set<string>(activePlayer?.museum?.minerals ?? []),
    ],
    [activePlayer],
  );

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer || !activePlayer.museum)
      return { completed, additionalDescription };
    
    const collection =
      museumArtifactCollected.size + museumMineralCollected.size;

    if (Object.hasOwn(reqs, name)) {
      completed = collection >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${reqs[name] - collection} left`;
      }
    }

    return { completed, additionalDescription };
  };

  const remainingDonations = {
    artifacts:
      Object.values(museum.artifacts).length - museumArtifactCollected.size,
    minerals:
      Object.values(museum.minerals).length - museumMineralCollected.size,
  };

  return (
    <>
      <Head>
        <title>stardew.app | Museum</title>
        <meta
          name="title"
          content="Stardew Valley Museum Artifacts | stardew.app"
        />
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
        className={`flex min-h-screen flex-col items-center px-5 pb-8 pt-2 md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Museum Tracker
          </h1>
          {/* Achievements Section */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
                  Achievements
                </AccordionTrigger>
                <AccordionContent asChild>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
                  All Artifacts
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="flex space-x-4">
                      <FilterButton
                        target={"0"}
                        _filter={_artifactFilter}
                        title={`Not Donated (${remainingDonations.artifacts})`}
                        setFilter={setArtifactFilter}
                      />
                      <FilterButton
                        target={"2"}
                        _filter={_artifactFilter}
                        title={`Donated (${museumArtifactCollected.size})`}
                        setFilter={setArtifactFilter}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {Object.values(museum.artifacts)
                        .filter((f) => {
                          if (_artifactFilter === "0") {
                            return !museumArtifactCollected.has(f.itemID); // incompleted
                          } else if (_artifactFilter === "2") {
                            return museumArtifactCollected.has(f.itemID); // completed
                          } else return true; // all
                        })
                        .map((f) => (
                          <BooleanCard
                            key={`artifact-${f.itemID}`}
                            item={f}
                            completed={museumArtifactCollected.has(f.itemID)}
                            setIsOpen={setIsOpen}
                            setObject={setMuseumArtifact}
                            type="artifact"
                            show={show}
                          />
                        ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Minerals Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              All Minerals
            </h2>
            <div className="flex space-x-4">
              <FilterButton
                target={"0"}
                _filter={_mineralFilter}
                title={`Not Donated (${remainingDonations.minerals})`}
                setFilter={setMineralFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_mineralFilter}
                title={`Donated (${museumMineralCollected.size})`}
                setFilter={setMineralFilter}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(museum.minerals)
                .filter((f) => {
                  if (_mineralFilter === "0") {
                    return !museumMineralCollected.has(f.itemID); // incompleted
                  } else if (_mineralFilter === "2") {
                    return museumMineralCollected.has(f.itemID); // completed
                  } else return true; // all
                })
                .map((f) => (
                  <BooleanCard
                    key={`mineral-${f.itemID}`}
                    item={f as MuseumItem}
                    completed={museumMineralCollected.has(f.itemID)}
                    setIsOpen={setIsOpen}
                    setObject={setMuseumArtifact}
                    type="mineral"
                    show={show}
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
        <UnblurDialog
          open={showPrompt}
          setOpen={setPromptOpen}
          toggleShow={toggleShow}
        />
      </main>
    </>
  );
}
