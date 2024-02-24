import Head from "next/head";

import achievements from "@/data/achievements.json";
import recipes from "@/data/cooking.json";
import objects from "@/data/objects.json";

import type { Recipe } from "@/types/recipe";

import { PlayersContext } from "@/contexts/players-context";
import { useContext, useEffect, useMemo, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { RecipeCard } from "@/components/cards/recipe-card";
import { FilterButton } from "@/components/filter-btn";
import { RecipeSheet } from "@/components/sheets/recipe-sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";
import { getCookie } from "cookies-next";

const semverGte = require("semver/functions/gte");

const reqs = {
  Cook: 10,
  "Sous Chef": 25,
  "Gourmet Chef": Object.keys(recipes).length, // 1.6 default
};

export default function Cooking() {
  const [open, setIsOpen] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [playerRecipes, setPlayerRecipes] = useState<{
    [key: string]: 0 | 1 | 2;
  }>({});

  const [gameVersion, setGameVersion] = useState("1.6.0");

  const [search, setSearch] = useState("");
  const [_filter, setFilter] = useState("all");

  const { activePlayer } = useContext(PlayersContext);

  useEffect(() => {
    const wantsToSeeUpdate = getCookie("disable_1_6");
    if (activePlayer) {
      if (activePlayer.cooking?.recipes) {
        setPlayerRecipes(activePlayer.cooking.recipes);
      }

      // update the requirements for achievements and set the minimum game version
      if (activePlayer.general?.gameVersion) {
        const version = activePlayer.general.gameVersion;
        setGameVersion(version);
      } else {
        if (!wantsToSeeUpdate) {
          setGameVersion("1.6.0");
        } else {
          setGameVersion("1.5.4");
        }
      }

      console.log(gameVersion, "gameVersion");

      reqs["Gourmet Chef"] = Object.values(recipes).filter((r) =>
        semverGte(gameVersion, r.minVersion)
      ).length;
    } else {
      if (!wantsToSeeUpdate) {
        setGameVersion("1.6.0");
      } else {
        setGameVersion("1.5.4");
      }
    }
  }, [activePlayer, gameVersion]);

  // useEffect(() => {
  //   console.log("gameVersion:", gameVersion);
  // }, [gameVersion]);

  const cookedCount = useMemo(() => {
    if (!activePlayer || !activePlayer.cooking?.recipes) return 0;

    return Object.values(activePlayer.cooking.recipes).filter((r) => r > 1)
      .length;
  }, [activePlayer]);

  // tracks how many recipes the players knows but has not cooked
  const knownCount = useMemo(() => {
    if (!activePlayer || !activePlayer.cooking?.recipes) return 0;

    return Object.values(activePlayer.cooking.recipes).filter((r) => r === 1)
      .length;
  }, [activePlayer]);

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer) {
      return { completed, additionalDescription };
    }

    completed = cookedCount >= reqs[name as keyof typeof reqs];

    if (!completed) {
      additionalDescription = ` - ${
        reqs[name as keyof typeof reqs] - cookedCount
      } more`;
    }
    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Cooking</title>
        <meta name="title" content="stardew.app | Cooking Tracker" />
        <meta
          name="description"
          content="Track and master cooking recipes in Stardew Valley. Keep tabs on the cooking recipes you've learned and monitor your progress towards becoming a skilled chef. Discover what recipes are left to learn and unlock the full potential of your culinary skills in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track and master cooking recipes in Stardew Valley. Keep tabs on the cooking recipes you've learned and monitor your progress towards becoming a skilled chef. Discover what recipes are left to learn and unlock the full potential of your culinary skills in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track and master cooking recipes in Stardew Valley. Keep tabs on the cooking recipes you've learned and monitor your progress towards becoming a skilled chef. Discover what recipes are left to learn and unlock the full potential of your culinary skills in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley cooking recipe tracker, stardew valley cooking recipes, stardew valley recipe collection, stardew valley skilled chef, stardew valley recipe progress, stardew valley culinary skills, stardew valley gameplay tracker, stardew valley, stardew, cooking tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
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
                      .filter((a) => a.description.includes("Cook"))
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
            <div className="grid grid-cols-1 lg:flex justify-between gap-2">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex">
                <FilterButton
                  target={"0"}
                  _filter={_filter}
                  title={`Unknown (${
                    reqs["Gourmet Chef"] - (knownCount + cookedCount)
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
                  title={`Cooked (${cookedCount})`}
                  setFilter={setFilter}
                />
              </div>
              <Command className="border border-b-0 max-w-xs dark:border-neutral-800">
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
                  const name = objects[r.itemID as keyof typeof objects].name;
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
                  />
                ))}
            </div>
          </section>
        </div>
        <RecipeSheet open={open} setIsOpen={setIsOpen} recipe={recipe} />
      </main>
    </>
  );
}
