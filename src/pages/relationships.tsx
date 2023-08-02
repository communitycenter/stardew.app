import Head from "next/head";

import achievements from "@/data/achievements.json";
import villagers from "@/data/villagers.json";

import type { Villager } from "@/types/items";

import { useContext, useState } from "react";
import { PlayersContext } from "@/contexts/players-context";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InfoCard } from "@/components/cards/info-card";
import { VillagerCard } from "@/components/cards/villager-card";
import { VillagerSheet } from "@/components/sheets/villager-sheet";
import { AchievementCard } from "@/components/cards/achievement-card";

import { IconBabyCarriage } from "@tabler/icons-react";
import { HeartIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/solid";

const reqs: Record<string, number> = {
  "A New Friend": 1,
  Cliques: 4,
  Networking: 10,
  Popular: 20,
  "Best Friends": 1,
  "The Beloved Farmer": 8,
  "Moving Up": 1,
  "Living Large": 2,
};

export default function Relationships() {
  const { activePlayer } = useContext(PlayersContext);

  const [open, setIsOpen] = useState(false);
  const [villager, setVillager] = useState<Villager>(villagers["Abigail"]);

  const getAchievementProgress = (name: string) => {
    const five = new Set(["A New Friend", "Cliques", "Networking", "Popular"]);
    const ten = new Set(["Best Friends", "The Beloved Farmer"]);
    const house = new Set(["Moving Up", "Living Large"]);
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer) {
      return { completed, additionalDescription };
    }

    if (five.has(name)) {
      // use 5 heart count relationships
      completed = activePlayer.social.fiveHeartCount >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${
          reqs[name] - activePlayer.social.fiveHeartCount
        } more`;
      }
    } else if (ten.has(name)) {
      // use 10 heart count relationships
      completed = activePlayer.social.tenHeartCount >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${
          reqs[name] - activePlayer.social.tenHeartCount
        } more`;
      }
    } else if (house.has(name)) {
      // house upgrades
      completed = activePlayer.social.houseUpgradeLevel >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${activePlayer.social.houseUpgradeLevel}/${reqs[name]}`;
      }
    } else {
      // get married and have two kids
      if (
        activePlayer.social.spouse &&
        activePlayer.social.spouse !== "" &&
        activePlayer.social.childrenCount >= 2
      ) {
        completed = true;
      }
      if (!completed) {
        additionalDescription = ` - ${activePlayer.social.childrenCount}/2 kids`;
      }
    }
    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Social Tracker</title>
        <meta
          name="description"
          content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
        />
        <meta
          name="og:description"
          content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
        />
        <meta
          name="twitter:description"
          content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
        />
        <meta
          name="keywords"
          content="stardew valley relationship tracker, stardew valley villager relationships, stardew valley heart levels, stardew valley gifts, stardew valley community, stardew valley friendship, stardew valley gameplay tracker, stardew valley, stardew, relationship tracker"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Social & Family Tracker
          </h1>
          {/* Info related to achievements */}
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
                Social & Family Information
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                  <InfoCard
                    title="Five Heart Relationships"
                    description={
                      activePlayer?.social.fiveHeartCount.toString() ??
                      "No Info"
                    }
                    Icon={HeartIcon}
                  />
                  <InfoCard
                    title="Ten Heart Relationships"
                    description={
                      activePlayer?.social.tenHeartCount.toString() ?? "No Info"
                    }
                    Icon={HeartIcon}
                  />
                  <InfoCard
                    title="Children"
                    description={
                      activePlayer?.social.childrenCount.toString() ?? "No Info"
                    }
                    Icon={IconBabyCarriage}
                  />
                  <InfoCard
                    title="House Upgrade Level"
                    description={
                      activePlayer?.social.houseUpgradeLevel.toString() ??
                      "No Info"
                    }
                    Icon={HomeIcon}
                  />
                  <InfoCard
                    title="Spouse"
                    description={activePlayer?.social.spouse ?? "No Info"}
                    Icon={UsersIcon}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Achievements Section */}
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="space-y-3"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
                Achievements
              </AccordionTrigger>
              <AccordionContent>
                <section className="space-y-3">
                  <h3 className="ml-1 text-base font-semibold text-gray-900 dark:text-white">
                    Relationships
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Object.values(achievements)
                      .filter((a) => a.description.includes("heart"))
                      .map((a) => {
                        const { completed, additionalDescription } =
                          getAchievementProgress(a.name);
                        return (
                          <AchievementCard
                            key={a.name}
                            achievement={a}
                            completed={completed}
                            additionalDescription={additionalDescription}
                          />
                        );
                      })}
                  </div>
                  <h3 className="ml-1 text-base font-semibold text-gray-900 dark:text-white">
                    Home & Family
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Object.values(achievements)
                      .filter(
                        (a) =>
                          a.description.includes("house") ||
                          a.description.includes("married")
                      )
                      .map((a) => {
                        const { completed, additionalDescription } =
                          getAchievementProgress(a.name);
                        return (
                          <AchievementCard
                            key={a.name}
                            achievement={a}
                            completed={completed}
                            additionalDescription={additionalDescription}
                          />
                        );
                      })}
                  </div>
                </section>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Villagers Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              All Villagers
            </h2>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              {Object.values(villagers).map((v) => (
                <VillagerCard
                  key={v.name}
                  villager={v}
                  points={
                    activePlayer?.social.relationships[v.name]?.points ?? 0
                  }
                  status={
                    activePlayer?.social.relationships[v.name]?.status ?? null
                  }
                  setIsOpen={setIsOpen}
                  setVillager={setVillager}
                />
              ))}
            </div>
          </section>
        </div>
        <VillagerSheet open={open} setIsOpen={setIsOpen} villager={villager} />
      </main>
    </>
  );
}
