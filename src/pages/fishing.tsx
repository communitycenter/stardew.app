import Head from "next/head";

import type { FishType } from "@/types/items";

import achievements from "@/data/achievements.json";
import fishes from "@/data/fish.json";
import objects from "@/data/objects.json";

import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";
import { useEffect, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { BooleanCard } from "@/components/cards/boolean-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { FilterButton, FilterSearch } from "@/components/filter-btn";
import { FishSheet } from "@/components/sheets/fish-sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";

import { IconClock, IconCloud } from "@tabler/icons-react";

const semverGte = require("semver/functions/gte");

const reqs: Record<string, number> = {
  Fisherman: 10,
  "Ol' Mariner": 24,
  "Master Angler": Object.keys(fishes).length,
  "Mother Catch": 100,
};

const weather = [
  {
    value: "Both",
    label: "All Weather",
  },
  {
    value: "Sunny",
    label: "Sunny",
  },
  {
    value: "Rainy",
    label: "Rainy",
  },
];

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

export default function Fishing() {
  const [open, setIsOpen] = useState(false);
  const [fish, setFish] = useState<FishType | null>(null);
  const [fishCaught, setFishCaught] = useState<Set<string>>(new Set());

  // unblur dialog
  const [showPrompt, setPromptOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [_filter, setFilter] = useState("all");
  const [_weatherFilter, setWeatherFilter] = useState("both");
  const [_seasonFilter, setSeasonFilter] = useState("all");

  const [gameVersion, setGameVersion] = useState("1.6.0");

  const { activePlayer } = usePlayers();
  const { show, toggleShow } = usePreferences();

  useEffect(() => {
    if (activePlayer) {
      setFishCaught(new Set(activePlayer?.fishing?.fishCaught ?? []));

      if (activePlayer.general?.gameVersion) {
        const version = activePlayer.general.gameVersion;
        setGameVersion(version);

        reqs["Master Angler"] = Object.values(fishes).filter((f) =>
          semverGte(version, f.minVersion),
        ).length;
      }
    }
  }, [activePlayer]);

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";
    if (!activePlayer) {
      return { completed, additionalDescription };
    }

    if (name === "Mother Catch") {
      const totalCaught = activePlayer?.fishing?.totalCaught ?? 0;
      completed = totalCaught >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${reqs[name] - totalCaught} more`;
      }
    } else {
      completed = fishCaught.size >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${reqs[name] - fishCaught.size} more`;
      }
    }
    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Fishing</title>
        <meta
          name="title"
          content="Stardew Valley Fishing Tracker | stardew.app"
        />
        <meta
          name="description"
          content="Track your Stardew Valley fishing progress in the new 1.6 update. Monitor your catch count, rare fish, and tackle usage to become a master angler. Discover the best fishing spots, seasons, and weather conditions for each fish. Take your fishing game to the next level and aim for 100% completion in Stardew Valley."
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
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Fishing Tracker
          </h1>
          {/* Achievements Section */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
                  Achievements
                </AccordionTrigger>
                <AccordionContent asChild>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Object.values(achievements)
                      .filter((a) => a.description.includes("fish"))
                      .map((a) => {
                        const { completed, additionalDescription } =
                          getAchievementProgress(a.name);

                        return (
                          <AchievementCard
                            key={a.id}
                            achievement={a}
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
          {/* All Fish Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              All Fish
            </h2>
            {/* Filters */}
            <div className="grid grid-cols-1 justify-between gap-2 lg:flex">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <FilterButton
                  target={"0"}
                  _filter={_filter}
                  title={`Incomplete (${
                    reqs["Master Angler"] - fishCaught.size
                  })`}
                  setFilter={setFilter}
                />
                <FilterButton
                  target={"2"}
                  _filter={_filter}
                  title={`Completed (${fishCaught.size})`}
                  setFilter={setFilter}
                />
              </div>
              <div className="grid grid-cols-1 items-stretch gap-2 sm:flex">
                <div className="grid grid-cols-1 gap-2 sm:flex  sm:gap-3">
                  <FilterSearch
                    _filter={_seasonFilter}
                    title={"Seasons"}
                    data={seasons}
                    setFilter={setSeasonFilter}
                    icon={IconClock}
                  />
                  <FilterSearch
                    _filter={_weatherFilter}
                    title={"Weather"}
                    data={weather}
                    setFilter={setWeatherFilter}
                    icon={IconCloud}
                  />
                </div>
                <div className="flex">
                  <Command className="border border-b-0 dark:border-neutral-800">
                    <CommandInput
                      onValueChange={(v) => setSearch(v)}
                      placeholder="Search Fish"
                    />
                  </Command>
                </div>
              </div>
            </div>
            {/* Fish Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(fishes)
                .filter((f) => semverGte(gameVersion, f.minVersion))
                .filter((f) => {
                  if (!search) return true;
                  const name = objects[f.itemID as keyof typeof objects].name;
                  return name.toLowerCase().includes(search.toLowerCase());
                })
                .filter((f) => {
                  if (_filter === "0") {
                    return !fishCaught.has(f.itemID); // incompleted
                  } else if (_filter === "2") {
                    return fishCaught.has(f.itemID); // completed
                  } else return true; // all
                })
                .filter((f) => {
                  if ("weather" in f && f.trapFish === false) {
                    if (_weatherFilter === "both") {
                      return true;
                    } else {
                      if (_weatherFilter === "Sunny") {
                        return f.weather === "Sunny" || f.weather === "Both";
                      } else if (_weatherFilter === "Rainy") {
                        return f.weather === "Rainy" || f.weather === "Both";
                      } else if (_weatherFilter === "Both") {
                        return true;
                      }
                    }
                  } else return true;
                })
                .filter((f) => {
                  if ("seasons" in f && f.trapFish === false) {
                    if (_seasonFilter === "all") return true;
                    return f.seasons.includes(_seasonFilter);
                  }
                  return true;
                })
                .map((f) => (
                  <BooleanCard
                    key={f.itemID}
                    item={f as FishType}
                    completed={fishCaught.has(f.itemID)}
                    setIsOpen={setIsOpen}
                    setObject={setFish}
                    type="fish"
                    setPromptOpen={setPromptOpen}
                    show={show}
                  />
                ))}
            </div>
          </section>
        </div>
        <FishSheet open={open} setIsOpen={setIsOpen} fish={fish} />
        <UnblurDialog
          open={showPrompt}
          setOpen={setPromptOpen}
          toggleShow={toggleShow}
        />
      </main>
    </>
  );
}
