import type { ShippingItem } from "@/types/items";

import Head from "next/head";

import achievements from "@/data/achievements.json";
import objects from "@/data/objects.json";
import shipping_items from "@/data/shipping.json";
export const typedShippingItems: Record<string, ShippingItem> = shipping_items;

import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";
import { useMemo, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { ShippingCard } from "@/components/cards/shipping-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { FilterButton, FilterSearch } from "@/components/filter-btn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";

import { IconClock } from "@tabler/icons-react";

const semverGte = require("semver/functions/gte");

const reqs: Record<string, number> = {
  Polyculture: Object.values(shipping_items).filter((i) => i.polyculture)
    .length,
  "Full Shipment": Object.keys(shipping_items).length - 2, // Clam and Smoked Fish is excluded in 1.6
};

const seasons = [
  {
    value: "all",
    label: "All Seasons",
  },
  {
    value: "Spring",
    label: "Spring",
  },
  {
    value: "Summer",
    label: "Summer",
  },
  {
    value: "Fall",
    label: "Fall",
  },
  {
    value: "Winter",
    label: "Winter",
  },
];

export default function Shipping() {
  const [search, setSearch] = useState("");
  const [_filter, setFilter] = useState("all");
  const [_seasonFilter, setSeasonFilter] = useState("all");

  const [showPrompt, setPromptOpen] = useState(false);

  const { activePlayer } = usePlayers();
  const { show, toggleShow } = usePreferences();

  const gameVersion = useMemo(() => {
    if (!activePlayer || !activePlayer.general?.gameVersion) return "1.6.0";

    const version = activePlayer.general.gameVersion;
    // update the requirements for achievements and set the minimum game version
    reqs["Full Shipment"] = Object.values(shipping_items).filter((i) =>
      semverGte(version, i.minVersion),
    ).length;

    if (semverGte(version, "1.6.0")) reqs["Full Shipment"]--; // Clam is excluded in 1.6

    reqs["Polyculture"] = Object.values(shipping_items).filter(
      (i) => i.polyculture && semverGte(version, i.minVersion),
    ).length;

    return version;
  }, [activePlayer]);

  const basicShipped = useMemo(() => {
    if (!activePlayer || !activePlayer.shipping?.shipped) return {};
    return activePlayer.shipping.shipped;
  }, [activePlayer]);

  const [polycultureCount, monocultureAchieved, basicShippedCount] =
    useMemo(() => {
      if (!activePlayer || !activePlayer.shipping?.shipped)
        return [0, false, 0];

      let polycultureCount = 0;
      let monocultureAchieved = false;
      let basicShippedCount = 0;

      Object.keys(activePlayer.shipping.shipped).forEach((key) => {
        if (semverGte(gameVersion, "1.6.0") && key === "372") return; // Clam and Smoked Fish is excluded in 1.6

        // Polyculture calculation
        if (shipping_items[key as keyof typeof shipping_items].polyculture) {
          if ((activePlayer.shipping?.shipped[key] ?? 0) >= 15)
            polycultureCount++;
        }

        // Monoculture calculation
        if (shipping_items[key as keyof typeof shipping_items].monoculture) {
          if ((activePlayer.shipping?.shipped[key] ?? 0) >= 300)
            monocultureAchieved = true;
        }

        // Basic Shipped calculation
        basicShippedCount++;
      });
      return [polycultureCount, monocultureAchieved, basicShippedCount];
    }, [activePlayer, gameVersion]);

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer) {
      return { completed, additionalDescription };
    }

    if (name === "Monoculture") {
      completed = monocultureAchieved;
      return { completed, additionalDescription };
    } else if (name === "Polyculture") {
      completed = polycultureCount >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${reqs[name] - polycultureCount} left`;
      }
      return { completed, additionalDescription };
    }

    completed = basicShippedCount >= reqs[name];

    if (!completed) {
      additionalDescription = ` - ${reqs[name] - basicShippedCount} left`;
    }
    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Shipping</title>
        <meta
          name="title"
          content="Stardew Valley Shipping Tracker | stardew.app"
        />
        <meta
          name="description"
          content="Track your shipping progress and achievements in Stardew Valley. View the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your shipping progress and achievements in Stardew Valley. View the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your shipping progress and achievements in Stardew Valley. View the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley shipping tracker, stardew valley shipping progress, stardew valley items shipped, stardew valley shipping achievements, stardew valley master shipper, stardew valley gameplay tracker, stardew valley, stardew, shipping tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Shipping Tracker
          </h1>
          {/* Achievements Section */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
                  Achievements
                </AccordionTrigger>
                <AccordionContent asChild>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Object.values(achievements)
                      .filter((a) => a.description.includes("Ship"))
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
          {/* All Shipping Items Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              All Items
            </h2>
            {/* Filters */}
            <div className="grid grid-cols-1 justify-between gap-2 xl:flex">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <FilterButton
                  target={"0"}
                  _filter={_filter}
                  title={`Unshipped (${
                    reqs["Full Shipment"] - basicShippedCount
                  })`}
                  setFilter={setFilter}
                />
                <FilterButton
                  target={"1"}
                  _filter={_filter}
                  title={`Polyculture (${
                    reqs["Polyculture"] - polycultureCount
                  })`}
                  setFilter={setFilter}
                />
                <FilterButton
                  target={"2"}
                  _filter={_filter}
                  title={`Completed (${basicShippedCount})`}
                  setFilter={setFilter}
                />
              </div>
              <div className="flex gap-2">
                <FilterSearch
                  _filter={_seasonFilter}
                  title={"Seasons"}
                  data={seasons}
                  setFilter={setSeasonFilter}
                  icon={IconClock}
                />
                <Command className="max-w-xs border border-b-0 dark:border-neutral-800">
                  <CommandInput
                    onValueChange={(v) => setSearch(v)}
                    placeholder="Search Items"
                  />
                </Command>
              </div>
            </div>
            {/* Items */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(typedShippingItems)
                .filter((i) => {
                  // Clam is excluded in 1.6, so we won't show it
                  if (i.itemID === "372")
                    return !semverGte(gameVersion, "1.6.0");
                  return true;
                })
                .filter((i) => semverGte(gameVersion, i.minVersion))
                .filter((i) => {
                  if (!search) return true;
                  const name = objects[i.itemID as keyof typeof objects].name;
                  return name.toLowerCase().includes(search.toLowerCase());
                })
                .filter((i) => {
                  if (_filter === "0") {
                    // Item not shipped
                    return !(i.itemID in basicShipped);
                  } else if (_filter === "1") {
                    // Polyculture crops that need completing
                    return (
                      i.itemID in shipping_items &&
                      shipping_items[i.itemID as keyof typeof shipping_items]
                        .polyculture &&
                      (!basicShipped[i.itemID] || basicShipped[i.itemID]! < 15)
                    );
                  } else if (_filter === "2") {
                    // Shipped/Completed (we won't check for monoculture here)
                    return i.itemID in basicShipped &&
                      shipping_items[i.itemID as keyof typeof shipping_items]
                        .polyculture
                      ? basicShipped[i.itemID]! >= 15
                      : basicShipped[i.itemID]! >= 1;
                  } else return true; // all recipes
                })
                .filter((i) => {
                  if (_seasonFilter === "all") return true;
                  return i.seasons.includes(_seasonFilter);
                })
                .map((i) => (
                  <ShippingCard
                    key={i.itemID}
                    item={i}
                    show={show}
                    setPromptOpen={setPromptOpen}
                  />
                ))}
            </div>
          </section>
        </div>
      </main>
      <UnblurDialog
        open={showPrompt}
        setOpen={setPromptOpen}
        toggleShow={toggleShow}
      />
    </>
  );
}
