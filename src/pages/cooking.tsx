import Head from "next/head";

import recipes from "@/data/cooking.json";
import achievements from "@/data/achievements.json";

import type { CookingRecipe } from "@/types/recipe";

import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { RecipeCard } from "@/components/cards/recipe-card";
import { CookingSheet } from "@/components/sheets/cooking-sheet";
import { AchievementCard } from "@/components/cards/achievement-card";

export default function Cooking() {
  const [open, setIsOpen] = useState(false);
  const [recipe, setRecipe] = useState<CookingRecipe | null>(null);

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
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((a) => a.description.includes("Cook"))
                .map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    id={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
                    completed={false}
                  />
                ))}
            </div>
          </section>
          {/* All Fish Section */}
          <Separator />
          <section className="space-y-3">
            <h2 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              All Recipes
            </h2>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {Object.values(recipes).map((f) => (
                <RecipeCard
                  key={f.itemID}
                  recipe={f}
                  completed={false}
                  setIsOpen={setIsOpen}
                  setObject={setRecipe}
                />
              ))}
            </div>
          </section>
        </div>
        <CookingSheet open={open} setIsOpen={setIsOpen} recipe={recipe} />
      </main>
    </>
  );
}
