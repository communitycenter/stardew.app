import type { NextPage } from "next";
import type { CraftingRecipe } from "../types/recipes";

import achievements from "../research/processors/data/achievements.json";
import crafting_recipes from "../research/processors/data/crafting_recipes.json";

import AchievementCard from "../components/achievementcard";
import InfoCard from "../components/infocard";
import SidebarLayout from "../components/sidebarlayout";
import RecipeCard from "../components/cooking/recipecard";
import RecipeSlideOver from "../components/cooking/recipeslideover";

import { useState } from "react";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import { useKV } from "../hooks/useKV";
import { InformationCircleIcon } from "@heroicons/react/solid";

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  "D.I.Y.": 15,
  Artisan: 30,
  "Craft Master": 129,
};

const Crafting: NextPage = () => {
  const [hasUploaded] = useKV<boolean>("general", "user", false);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showRecipe, setShowRecipe] = useState<boolean>(false);

  const [name] = useKV("general", "name", "Farmer");
  const [craftedCount] = useKV("crafting", "craftedCount", 0);
  const [knownCount] = useKV("crafting", "knownCount", 0);

  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe>(
    Object.values(crafting_recipes)[0]
  );

  return (
    <>
      <Head>
        <title>stardew.app | Crafting</title>
        <meta
          name="description"
          content="Track your Stardew Valley crafting recipe progress. See what recipes you need to craft for 100% completion on Stardew Valley."
        />
        d
      </Head>
      <SidebarLayout
        activeTab="Crafting"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Crafting
          </h1>
          <div>
            <label className="flex cursor-pointer flex-col items-center rounded-md border border-gray-300 bg-white p-1 text-white hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]">
              <span className="flex justify-between">
                {" "}
                <FilterIcon
                  className="h-5 w-5 text-black dark:bg-[#1F1F1F] dark:text-white"
                  aria-hidden="true"
                />
              </span>
            </label>
          </div>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div>
            <h2 className="my-2 text-lg font-semibold text-gray-900 dark:text-white">
              Achievements
            </h2>
            <InfoCard
              title={`${name} knows how to craft ${knownCount}/129 recipes and has crafted ${craftedCount}/129 recipes.`}
              Icon={InformationCircleIcon}
            />
            <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "crafting")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    additionalDescription={
                      craftedCount >= requirements[achievement.name]
                        ? ""
                        : ` - ${80 - craftedCount} left!`
                    }
                    sourceURL={achievement.iconURL}
                    initialChecked={
                      craftedCount >= requirements[achievement.name]
                    }
                  />
                ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            All Recipes
          </h2>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.values(crafting_recipes).map((recipe: any) => (
              <RecipeCard
                key={recipe.itemID}
                category={"crafting"}
                bigCraftable={recipe.bigCraftable}
                recipe={recipe}
                setSelectedRecipe={setSelectedRecipe}
                setShowRecipe={setShowRecipe}
              />
            ))}
          </div>
        </div>
      </SidebarLayout>

      <RecipeSlideOver
        isOpen={showRecipe}
        selected={selectedRecipe}
        setOpen={setShowRecipe}
      />
    </>
  );
};

export default Crafting;
