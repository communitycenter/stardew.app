import Head from "next/head";

import achievements from "@/data/achievements.json";
import bundlesData from "@/data/bundles.json";

import {
  Bundle,
  BundleWithStatus,
  BundleItem,
  BundleItemWithLocation,
  CommunityCenterRoomName,
  CommunityCenterRoom,
  isRandomizer,
  Randomizer,
  CommunityCenter,
} from "@/types/bundles";

import { PlayerType, usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";

import { AchievementCard } from "@/components/cards/achievement-card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BooleanCard } from "@/components/cards/boolean-card";
import { use, useEffect, useState } from "react";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { BundleSheet } from "@/components/sheets/bundle_sheet";
import { get } from "http";

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

function BundleCompleted(bundleWithStatus: BundleWithStatus): boolean {
  if (bundleWithStatus.bundle.itemsRequired === -1) {
    // Gold bundles are encoded in the save file as requiring -1 items
    return bundleWithStatus.bundleStatus[0];
  }
  return bundleWithStatus.bundleStatus
    .slice(0, bundleWithStatus.bundle.itemsRequired)
    .every((status) => status);
}

function ResolveBundleRandomizer(bundleRandomizer: Randomizer): Bundle[] {
  let selectionCount = bundleRandomizer.selectionCount;
  let relevantBundles = bundleRandomizer.options.slice(
    0,
    selectionCount,
  ) as Bundle[];
  let resolvedBundles: Bundle[] = [];
  relevantBundles.forEach((bundle) => {
    resolvedBundles.push(ResolveItemRandomizers(bundle));
  });
  return resolvedBundles;
}

function ResolveItemRandomizers(bundle: Bundle): Bundle {
  let finishedBundle = {
    ...bundle,
  };
  if (isRandomizer(bundle.items)) {
    let selectionCount = bundle.items.selectionCount;
    let relevantItems = bundle.items.options.slice(
      0,
      selectionCount,
    ) as BundleItem[];
    finishedBundle.items = relevantItems;
  } else {
    let items: BundleItem[] = [];
    bundle.items.forEach((item) => {
      if (isRandomizer(item)) {
        let selectionCount = item.selectionCount;
        let relevantItems = item.options.slice(
          0,
          selectionCount,
        ) as BundleItem[];
        items = items.concat(relevantItems);
      } else {
        items.push(item);
      }
    });
    finishedBundle.items = items;
  }
  return finishedBundle;
}

function GetActiveBundles(
  activePlayer: PlayerType | undefined,
): BundleWithStatus[] {
  let activeBundles: BundleWithStatus[] = [];
  if (activePlayer && activePlayer.bundles) {
    activeBundles = activePlayer.bundles;
  } else {
    let allBundlesWithStatuses: BundleWithStatus[] = [];
    CommunityCenterAreas.forEach((areaName) => {
      let areaBundleSpecification = bundlesData[areaName];
      let resolvedBundles: Bundle[] = [];
      areaBundleSpecification.forEach((bundleSpecification) => {
        if (isRandomizer(bundleSpecification)) {
          resolvedBundles.push(...ResolveBundleRandomizer(bundleSpecification));
        } else {
          resolvedBundles.push(
            ResolveItemRandomizers(bundleSpecification as Bundle),
          );
        }
      });
      let areaBundles = resolvedBundles.map((bundle) => {
        let bundleStatus: boolean[] = [];
        bundle.items.forEach(() => {
          bundleStatus.push(false);
        });
        bundle.areaName = areaName;
        bundle.localizedName = bundle.name;
        return {
          bundle,
          bundleStatus,
        };
      });
      allBundlesWithStatuses = allBundlesWithStatuses.concat(areaBundles);
      // console.log(allBundlesWithStatuses);
    });
    activeBundles = allBundlesWithStatuses;
  }
  return activeBundles;
}

export default function Bundles() {
  // unblur dialog
  const [showPrompt, setPromptOpen] = useState(false);
  const { show, toggleShow } = usePreferences();

  let [open, setIsOpen] = useState(false);
  let [object, setObject] = useState<BundleItem | null>(null);
  let [bundles, setBundles] = useState<BundleWithStatus[]>([]);
  const { activePlayer } = usePlayers();

  useEffect(() => {
    setBundles(GetActiveBundles(activePlayer));
  }, [activePlayer]);

  const getAchievementProgress = (name: string) => {
    if (bundles.length < 1) {
      // Guard for this function being called prior to bundles being loaded
      return { completed: false, additionalDescription: "" };
    }

    let completed = false;
    let additionalDescription = "";

    if (name === "Local Legend") {
      let completedCount = bundles.reduce((acc, curBundelRet) => {
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
          <AccordionSection title="Achievements" key="Achievements">
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
            let areaBundles: BundleWithStatus[] = [];
            if (activePlayer && activePlayer.bundles) {
              areaBundles = activePlayer.bundles.filter(
                (bundleWithStatus) =>
                  bundleWithStatus.bundle.areaName === areaName,
              );
            } else {
              areaBundles = bundles.filter(
                (bundleWithStatus) =>
                  bundleWithStatus.bundle.areaName === areaName,
              );
            }
            return (
              <AccordionSection key={areaName} title={areaName}>
                {areaBundles.map((bundleWithStatus: BundleWithStatus) => {
                  return (
                    <AccordionSection
                      key={bundleWithStatus.bundle.localizedName}
                      title={bundleWithStatus.bundle.localizedName + " Bundle"}
                    >
                      {bundleWithStatus.bundle.items.map(
                        (item, index: number) => {
                          if (isRandomizer(item)) {
                            // Guard clause for type coercion
                            return <></>;
                          }
                          const BundleItemWithLocation: BundleItemWithLocation =
                            {
                              ...item,
                              index: index,
                              bundleID: bundleWithStatus.bundle.name,
                            };
                          return (
                            <BooleanCard
                              key={item.itemID + "-" + index}
                              item={BundleItemWithLocation}
                              setIsOpen={setIsOpen}
                              completed={bundleWithStatus.bundleStatus[index]}
                              setObject={setObject}
                              type="bundleItem"
                              show={show}
                            />
                          );
                        },
                      )}
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
