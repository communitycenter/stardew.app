import Head from "next/head";

import shipping_items from "@/data/shipping.json";
import achievements from "@/data/achievements.json";

import { useContext, useEffect, useState } from "react";
import { PlayersContext } from "@/contexts/players-context";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilterButton } from "@/components/filter-btn";
import { ShippingCard } from "@/components/cards/shipping-card";
import { AchievementCard } from "@/components/cards/achievement-card";

const reqs = {
  Polyculture: Object.values(shipping_items).filter((i) => i.polyculture)
    .length,
  "Full Shipment": Object.keys(shipping_items).length,
};

export default function Shipping() {
  const [basicShipped, setBasicShipped] = useState({});

  const [_filter, setFilter] = useState("all");

  const { activePlayer } = useContext(PlayersContext);

  useEffect(() => {
    if (activePlayer) {
      setBasicShipped(activePlayer.shipping.shipped);
    }
  }, [activePlayer]);

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer) {
      return { completed, additionalDescription };
    }

    if (name === "Monoculture") {
      completed = activePlayer.shipping.monoculture;
      return { completed, additionalDescription };
    } else if (name === "Polyculture") {
      completed = activePlayer.shipping.polycultureCount >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${
          reqs[name] - activePlayer.shipping.polycultureCount
        } more`;
      }
      return { completed, additionalDescription };
    }

    completed =
      activePlayer.shipping.basicShippedCount >=
      reqs[name as keyof typeof reqs];

    if (!completed) {
      additionalDescription = ` - ${
        reqs[name as keyof typeof reqs] -
        activePlayer.shipping.basicShippedCount
      } more`;
    }
    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Shipping Tracker</title>
        <meta
          name="description"
          content="Track your shipping progress and achievements in Stardew Valley. Keep tabs on the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your shipping progress and achievements in Stardew Valley. Keep tabs on the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your shipping progress and achievements in Stardew Valley. Keep tabs on the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley shipping tracker, stardew valley shipping progress, stardew valley items shipped, stardew valley shipping achievements, stardew valley master shipper, stardew valley gameplay tracker, stardew valley, stardew, shipping tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Cooking Tracker
          </h1>
          {/* Achievements Section */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white pt-0">
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
            <div className="flex space-x-4">
              <FilterButton
                target={"0"}
                _filter={_filter}
                title="Unshipped"
                setFilter={setFilter}
              />
              <FilterButton
                target={"1"}
                _filter={_filter}
                title="Polyculture"
                setFilter={setFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_filter}
                title="Completed"
                setFilter={setFilter}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(shipping_items)
                .filter((i) => {
                  if (_filter === "0") {
                    // Item not shipped
                    return !(i.itemID in basicShipped);
                  } else if (_filter === "1") {
                    // Polyculture crops that need completing
                    return (
                      i.itemID in basicShipped &&
                      i.itemID in shipping_items &&
                      shipping_items[
                        i.itemID.toString() as keyof typeof shipping_items
                      ].polyculture &&
                      basicShipped[i.itemID as keyof typeof basicShipped] <= 15
                    );
                  } else if (_filter === "2") {
                    // Shipped/Completed (we won't check for monoculture here)
                    return i.itemID in basicShipped &&
                      shipping_items[
                        i.itemID.toString() as keyof typeof shipping_items
                      ].polyculture
                      ? basicShipped[i.itemID as keyof typeof basicShipped] >=
                          15
                      : basicShipped[i.itemID as keyof typeof basicShipped] >=
                          1;
                  } else return true; // all recipes
                })
                .map((i) => (
                  <ShippingCard
                    key={i.itemID}
                    item={i}
                    count={
                      basicShipped[i.itemID as keyof typeof basicShipped] ?? 0
                    }
                    status={
                      i.itemID in basicShipped
                        ? shipping_items[
                            i.itemID.toString() as keyof typeof shipping_items
                          ].polyculture
                          ? basicShipped[
                              i.itemID as keyof typeof basicShipped
                            ] >= 15
                            ? 2
                            : 1
                          : 2
                        : 0
                    }
                  />
                ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
