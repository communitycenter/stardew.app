import Head from "next/head";

import achievements from "@/data/achievements.json";
import bundles from "@/data/bundles.json";

import {
  Bundle,
  BundleItem,
  CommunityCenterRoomName,
  CommunityCenterRoom,
  isRandomizer,
} from "@/types/bundles";

import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";

import { AchievementCard } from "@/components/cards/achievement-card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BundleRet } from "@/lib/parsers/bundles";
import { BooleanCard } from "@/components/cards/boolean-card";
import { useState } from "react";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { BundleSheet } from "@/components/sheets/bundle_sheet";

type AccordionSectionProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const CommunityCenterAreas: CommunityCenterRoomName[] = [
  "Pantry",
  "Crafts Room",
  "Fish Tank",
  "Boiler Room",
  "Vault",
  "Bulletin Board",
  "Abandoned Joja Mart",
];

function AccordionSection(props: AccordionSectionProps): JSX.Element {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" asChild>
      <section className="space-y-3">
        <AccordionItem value="item-1">
          <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
            {props.title}
          </AccordionTrigger>
          <AccordionContent asChild>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {props.children}
            </div>
          </AccordionContent>
        </AccordionItem>
      </section>
    </Accordion>
  );
}

function BundleCompleted(bundleRet: BundleRet): boolean {
  if (bundleRet.bundle.itemsRequired === -1) {
    // Gold bundles are encoded in the save file as requiring -1 items
    return bundleRet.bundleStatus[0];
  }
  return bundleRet.bundleStatus
    .slice(0, bundleRet.bundle.itemsRequired)
    .every((status) => status);
}

export default function Bundles() {
  // unblur dialog
  const [showPrompt, setPromptOpen] = useState(false);
  const { show, toggleShow } = usePreferences();

  let [open, setIsOpen] = useState(false);
  let [object, setObject] = useState<BundleItem | null>(null);
  const { activePlayer } = usePlayers();

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer || !activePlayer.bundles)
      return { completed, additionalDescription };

    if (name === "Local Legend") {
      let completedCount = activePlayer.bundles.reduce((acc, curBundelRet) => {
        if (BundleCompleted(curBundelRet)) return acc + 1;
        return acc;
      }, 0);
      completed = completedCount >= 31;
      if (!completed) {
        additionalDescription = ` - ${
          31 - completedCount
        } more bundles to complete the community center`;
      }
    }

    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Bundles</title>
        <meta name="title" content="Stardew Valley Bundles | stardew.app" />
        <meta
          name="description"
          content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
        />
        <meta
          name="og:description"
          content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
        />
        <meta
          name="twitter:description"
          content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
        />
        <meta
          name="keywords"
          content="stardew valley bundle tracker, stardew valley community center bundles, stardew valley bundle items, stardew valley bundle progress, stardew valley community center restoration, stardew valley gameplay tracker, stardew valley, stardew, bundle tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen items-center justify-center border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Bundle Tracker
          </h1>
          <AccordionSection title="Achievements">
            {Object.values(achievements)
              .filter((a) => a.description.includes("Community Center"))
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
          </AccordionSection>
          {CommunityCenterAreas.map((areaName: CommunityCenterRoomName) => {
            let areaBundles: BundleRet[] = [];
            if (activePlayer && activePlayer.bundles) {
              areaBundles = activePlayer.bundles.filter(
                (bundleRet) => bundleRet.bundle.areaName === areaName,
              );
            } else {
              return <></>;
              let areaBundleSpecification = bundles[areaName];
              let relevantBundles: Bundle[] = [];
              areaBundleSpecification.forEach((bundleSpecification) => {
                if (isRandomizer(bundleSpecification)) {
                  let selectionCount = bundleSpecification.selectionCount;
                  relevantBundles.push(
                    ...(bundleSpecification.options.slice(
                      0,
                      selectionCount,
                    ) as Bundle[]),
                  );
                } else {
                  relevantBundles.push(bundleSpecification as Bundle);
                }
              });
              if (isRandomizer(areaBundleSpecification)) {
                let selectionCount = areaBundleSpecification.selectionCount;
                let relevantBundles = areaBundleSpecification.options.slice(
                  0,
                  selectionCount,
                ) as Bundle[];
              } else {
              }
            }
            return (
              <AccordionSection key={areaName} title={areaName}>
                {areaBundles.map((bundleRet: BundleRet) => {
                  return (
                    <AccordionSection
                      key={bundleRet.bundle.localizedName}
                      title={bundleRet.bundle.localizedName + " Bundle"}
                    >
                      {bundleRet.bundle.items.map((item, index: number) => {
                        if (isRandomizer(item)) {
                          // Guard clause for type coercion
                          return <></>;
                        }
                        return (
                          <BooleanCard
                            key={item.itemID}
                            item={item}
                            setIsOpen={setIsOpen}
                            completed={bundleRet.bundleStatus[index]}
                            setObject={setObject}
                            type="bundleItem"
                            show={show}
                          />
                        );
                      })}
                    </AccordionSection>
                  );
                })}
              </AccordionSection>
            );
          })}
          <BundleSheet open={open} setIsOpen={setIsOpen} bundleItem={object} />
          <UnblurDialog
            open={showPrompt}
            setOpen={setPromptOpen}
            toggleShow={toggleShow}
          />
        </div>
      </main>
    </>
  );
}
