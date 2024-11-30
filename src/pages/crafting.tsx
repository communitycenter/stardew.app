import Head from "next/head";

import achievements from "@/data/achievements.json";
import bigobjects from "@/data/big_craftables.json";
import recipes from "@/data/crafting.json";
import objects from "@/data/objects.json";

import type { CraftingRecipe } from "@/types/recipe";

import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";
import { useEffect, useMemo, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { RecipeCard } from "@/components/cards/recipe-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { FilterButton } from "@/components/filter-btn";
import { RecipeSheet } from "@/components/sheets/recipe-sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";

const semverGte = require("semver/functions/gte");

const reqs: Record<string, number> = {
  "D.I.Y.": 15,
  Artisan: 30,
  "Craft Master": Object.keys(recipes).length,
};

export default function Crafting() {
  const [open, setIsOpen] = useState(false);
  const [recipe, setRecipe] = useState<CraftingRecipe | null>(null);
  const [playerRecipes, setPlayerRecipes] = useState<{
    [key: string]: 0 | 1 | 2;
  }>({});

  const [gameVersion, setGameVersion] = useState("1.6.0");

  const [search, setSearch] = useState("");
  const [_filter, setFilter] = useState("all");

  const [showPrompt, setPromptOpen] = useState(false);

  const { activePlayer } = usePlayers();
  const { show, toggleShow } = usePreferences();

  useEffect(() => {
    if (activePlayer) {
      if (activePlayer.crafting?.recipes) {
        setPlayerRecipes(activePlayer.crafting.recipes);
      } else setPlayerRecipes({});

      // update the requirements for achievements and set the minimum game version
      if (activePlayer.general?.gameVersion) {
        const version = activePlayer.general.gameVersion;
        setGameVersion(version);

        reqs["Craft Master"] = Object.values(recipes).filter((r) =>
          semverGte(version, r.minVersion),
        ).length;
      }
    }
  }, [activePlayer]);

  // calculate craftedCount here (all values of 2)
  const craftedCount = useMemo(() => {
    if (!activePlayer || !activePlayer.crafting?.recipes) return 0;

    return Object.values(activePlayer.crafting.recipes).filter((r) => r === 2)
      .length;
  }, [activePlayer]);

  // tracks how many recipes the player knows but hasn't crafted
  const knownCount = useMemo(() => {
    if (!activePlayer || !activePlayer.crafting?.recipes) return 0;

    return Object.values(activePlayer.crafting.recipes).filter((r) => r === 1)
      .length;
  }, [activePlayer]);

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer) {
      return { completed, additionalDescription };
    }

    completed = craftedCount >= reqs[name];

    if (!completed) {
      additionalDescription = ` - ${reqs[name] - craftedCount} left`;
    }

    return { completed, additionalDescription };
  };

  const getName = (id: string, isBigCraftable: boolean) => {
    if (isBigCraftable) {
      return bigobjects[id as keyof typeof bigobjects].name;
    } else {
      return objects[id as keyof typeof objects].name;
    }
  };

  return (
    <>
      <Head>
        <title>stardew.app | Crafting</title>
        <meta
          name="title"
          content="Stardew Valley Crafting Recipes | stardew.app"
        />
        <meta
          name="description"
          content="Track and complete crafting recipes in Stardew Valley's new 1.6 update. Keep tabs on the crafting recipes you've unlocked and monitor your progress towards completing the full recipe collection. Discover what recipes are left to unlock and become a master crafter in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track and complete crafting recipes in Stardew Valley's new 1.6 update. Keep tabs on the crafting recipes you've unlocked and monitor your progress towards completing the full recipe collection. Discover what recipes are left to unlock and become a master crafter in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track and complete crafting recipes in Stardew Valley's new 1.6 update. Keep tabs on the crafting recipes you've unlocked and monitor your progress towards completing the full recipe collection. Discover what recipes are left to unlock and become a master crafter in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley crafting recipe tracker, stardew valley crafting recipes, stardew valley recipe collection, stardew valley master crafter, stardew valley recipe progress, stardew valley crafting achievements, stardew valley gameplay tracker, stardew valley, stardew, crafting tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Crafting Tracker
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
                      .filter((a) => a.description.includes("Craft"))
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
          {/* All Recipes Section */}
          <section className="space-y-3">
            <h3 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              All Recipes
            </h3>
            {/* Filters */}
            <div className="grid grid-cols-1 justify-between gap-2 lg:flex">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <FilterButton
                  target={"0"}
                  _filter={_filter}
                  title={`Unknown (${
                    reqs["Craft Master"] - (knownCount + craftedCount)
                  })`}
                  setFilter={setFilter}
                />
                <FilterButton
                  target={"1"}
                  _filter={_filter}
                  title={`Known (${knownCount})`}
                  setFilter={setFilter}
                />
                <FilterButton
                  target={"2"}
                  _filter={_filter}
                  title={`Crafted (${craftedCount})`}
                  setFilter={setFilter}
                />
              </div>
              <Command className="max-w-xs border border-b-0 dark:border-neutral-800">
                <CommandInput
                  onValueChange={(v) => setSearch(v)}
                  placeholder="Search Recipes"
                />
              </Command>
            </div>
            {/* Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(recipes)
                .filter((r) => semverGte(gameVersion, r.minVersion))
                .filter((r) => {
                  if (!search) return true;
                  const name = getName(r.itemID, r.isBigCraftable);
                  return name.toLowerCase().includes(search.toLowerCase());
                })
                .filter((r) => {
                  if (_filter === "0") {
                    // unknown recipes (not in playerRecipes)
                    return !(
                      r.itemID in playerRecipes && playerRecipes[r.itemID] > 0
                    );
                  } else if (_filter === "1") {
                    // known recipes (in playerRecipes) and not cooked
                    return (
                      r.itemID in playerRecipes && playerRecipes[r.itemID] === 1
                    );
                  } else if (_filter === "2") {
                    // cooked recipes (in playerRecipes) and cooked
                    return (
                      r.itemID in playerRecipes && playerRecipes[r.itemID] === 2
                    );
                  } else return true; // all recipes
                })
                .map((f) => (
                  <RecipeCard
                    key={f.itemID}
                    recipe={f}
                    status={
                      f.itemID in playerRecipes ? playerRecipes[f.itemID] : 0
                    }
                    setIsOpen={setIsOpen}
                    setObject={setRecipe}
                    setPromptOpen={setPromptOpen}
                    show={show}
                  />
                ))}
            </div>
          </section>
        </div>
        <RecipeSheet open={open} setIsOpen={setIsOpen} recipe={recipe} />
        <UnblurDialog
          open={showPrompt}
          setOpen={setPromptOpen}
          toggleShow={toggleShow}
        />
      </main>
    </>
  );
}
