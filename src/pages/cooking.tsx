import Head from "next/head";

import recipes from "@/data/cooking.json";
import achievements from "@/data/achievements.json";

import type { Recipe } from "@/types/recipe";

import { useContext, useEffect, useState } from "react";
import { PlayersContext } from "@/contexts/players-context";

import { Separator } from "@/components/ui/separator";
import { FilterButton } from "@/components/filter-btn";
import { RecipeCard } from "@/components/cards/recipe-card";
import { RecipeSheet } from "@/components/sheets/recipe-sheet";
import { AchievementCard } from "@/components/cards/achievement-card";

const reqs = {
  Cook: 10,
  "Sous Chef": 25,
  "Gourmet Chef": Object.keys(recipes).length,
};

export default function Cooking() {
  const [open, setIsOpen] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [playerRecipes, setPlayerRecipes] = useState({});

  const [_filter, setFilter] = useState("all");

  const { activePlayer } = useContext(PlayersContext);

  useEffect(() => {
    if (activePlayer) {
      setPlayerRecipes(activePlayer.cooking.recipes);
    }
  }, [activePlayer]);

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (!activePlayer) {
      return { completed, additionalDescription };
    }

    completed =
      activePlayer.cooking.cookedCount >= reqs[name as keyof typeof reqs];

    if (!completed) {
      additionalDescription = ` - ${
        reqs[name as keyof typeof reqs] - activePlayer.cooking.cookedCount
      } more`;
    }
    return { completed, additionalDescription };
  };

  return (
    <>
      <Head>
        <title>stardew.app | Cooking Tracker</title>
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
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 py-2 px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Cooking Tracker
          </h1>
          {/* Achievements Section */}
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Achievements
            </h2>
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
          </section>
          {/* All Recipes Section */}
          <Separator />
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              All Recipes
            </h2>
            <div className="flex space-x-4">
              <FilterButton
                target={"0"}
                _filter={_filter}
                title="Unknown Recipes"
                setFilter={setFilter}
              />
              <FilterButton
                target={"1"}
                _filter={_filter}
                title="Known Recipes"
                setFilter={setFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_filter}
                title="Cooked Recipes"
                setFilter={setFilter}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(recipes)
                .filter((r) => {
                  if (_filter === "0") {
                    // unknown recipes (not in playerRecipes)
                    return !(
                      r.itemID in playerRecipes &&
                      playerRecipes[r.itemID as keyof typeof playerRecipes] > 0
                    );
                  } else if (_filter === "1") {
                    // known recipes (in playerRecipes) and not cooked
                    return (
                      r.itemID in playerRecipes &&
                      playerRecipes[r.itemID as keyof typeof playerRecipes] ===
                        1
                    );
                  } else if (_filter === "2") {
                    // cooked recipes (in playerRecipes) and cooked
                    return (
                      r.itemID in playerRecipes &&
                      playerRecipes[r.itemID as keyof typeof playerRecipes] ===
                        2
                    );
                  } else return true; // all recipes
                })
                .map((f) => (
                  <RecipeCard
                    key={f.itemID}
                    recipe={f}
                    status={
                      f.itemID in playerRecipes
                        ? playerRecipes[f.itemID as keyof typeof playerRecipes]
                        : 0
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
