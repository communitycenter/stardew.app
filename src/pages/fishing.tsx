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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useMultiSelect } from "@/contexts/multi-select-context";
import { BulkActionDialog } from "@/components/dialogs/bulk-action-dialog";

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

const bubbleColors: Record<string, string> = {
  "0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // incomplete
  "2": "border-green-900 bg-green-500/20", // completed
};

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

  const { activePlayer, patchPlayer } = usePlayers();
  const { show, toggleShow } = usePreferences();

  const {
    isMultiSelectMode,
    toggleMultiSelectMode,
    selectedItems,
    clearSelection,
  } = useMultiSelect();
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

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
        additionalDescription = ` - ${reqs[name] - totalCaught} left`;
      }
    } else {
      completed = fishCaught.size >= reqs[name];
      if (!completed) {
        additionalDescription = ` - ${reqs[name] - fishCaught.size} left`;
      }
    }
    return { completed, additionalDescription };
  };

  // Custom bulk action handler for fishing
  const handleFishingBulkAction = async (
    status: number | null,
    selectedItems: Set<string>,
    close: () => void,
  ) => {
    if (!activePlayer) return;
    const current = new Set(activePlayer.fishing?.fishCaught ?? []);
    selectedItems.forEach((id) => {
      if (status === 2) current.add(id);
      if (status === 0) current.delete(id);
    });
    await patchPlayer({
      fishing: { fishCaught: Array.from(current) },
    });
    close();
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
            {/* Filters and Actions Row */}
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-row items-center gap-2">
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={_filter}
                  onValueChange={(val) =>
                    setFilter(val === _filter ? "all" : val)
                  }
                  className="gap-2"
                >
                  <ToggleGroupItem value="0" aria-label="Show Uncaught">
                    <span
                      className={cn(
                        "inline-block h-4 w-4 rounded-full border align-middle",
                        bubbleColors["0"],
                      )}
                    />
                    <span className="align-middle">
                      Uncaught ({reqs["Master Angler"] - fishCaught.size})
                    </span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="2" aria-label="Show Caught">
                    <span
                      className={cn(
                        "inline-block h-4 w-4 rounded-full border align-middle",
                        bubbleColors["2"],
                      )}
                    />
                    <span className="align-middle">
                      Caught ({fishCaught.size})
                    </span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex flex-row items-center gap-2">
                <FilterSearch
                  title="Weather"
                  _filter={_weatherFilter}
                  data={weather}
                  icon={IconCloud}
                  setFilter={setWeatherFilter}
                />
                <FilterSearch
                  title="Season"
                  _filter={_seasonFilter}
                  data={seasons}
                  icon={IconClock}
                  setFilter={setSeasonFilter}
                />
                <Button
                  variant={isMultiSelectMode ? "default" : "outline"}
                  onClick={() => {
                    if (isMultiSelectMode) {
                      setBulkActionOpen(true);
                    } else {
                      toggleMultiSelectMode();
                    }
                  }}
                  disabled={isMultiSelectMode && selectedItems.size === 0}
                >
                  {isMultiSelectMode
                    ? `Bulk Action (${selectedItems.size})`
                    : "Select Multiple"}
                </Button>
                {isMultiSelectMode && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-1"
                    onClick={() => {
                      clearSelection();
                      toggleMultiSelectMode();
                    }}
                    aria-label="Cancel Multi-Select"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {/* Search Bar Row */}
            <div className="mt-2 w-full">
              <Command className="w-full border border-b-0 dark:border-neutral-800">
                <CommandInput
                  onValueChange={(v) => setSearch(v)}
                  placeholder="Search Fish"
                />
              </Command>
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
                    return !fishCaught.has(f.itemID.toString()); // uncaught
                  } else if (_filter === "2") {
                    return fishCaught.has(f.itemID.toString()); // caught
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
                    completed={fishCaught.has(f.itemID.toString())}
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
        <BulkActionDialog
          open={bulkActionOpen}
          setOpen={setBulkActionOpen}
          type="shipping"
          onBulkAction={handleFishingBulkAction}
        />
      </main>
    </>
  );
}
