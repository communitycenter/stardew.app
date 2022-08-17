import type { NextPage } from "next";
import type { CookingRecipe } from "../types";

import achievements from "../research/processors/data/achievements.json";
import cooking_recipes from "../research/processors/data/cooking_recipes.json";

import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import SidebarLayout from "../components/sidebarlayout";
import RecipeCard from "../components/cards/recipecard";
import RecipeSlideOver from "../components/slideovers/recipeslideover";

import { useState } from "react";
import Head from "next/head";

import { FilterIcon } from "@heroicons/react/outline";
import { useKV } from "../hooks/useKV";
import { InformationCircleIcon } from "@heroicons/react/solid";

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  Cook: 10,
  "Sous Chef": 25,
  "Gourmet Chef": 80,
};

const Cooking: NextPage = () => {
  const [recipes, setRecipes] = useState<any>(cooking_recipes);

  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);

  const [name] = useKV("general", "name", "Farmer");
  const [cookedCount] = useKV("cooking", "cookedCount", 0);
  const [knownCount] = useKV("cooking", "knownCount", 0);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showRecipe, setShowRecipe] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<CookingRecipe>(
    Object.values(cooking_recipes)[0]
  );

  return (
    <>
      <Head>
        <title>stardew.app | Cooking</title>
        <meta
          name="description"
          content="Track your Stardew Valley cooking recipe progress. See what recipes you need to cook for 100% completion on Stardew Valley."
        />
        d
      </Head>
      <SidebarLayout
        activeTab="Cooking"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Cooking
          </h1>
          <div>
            <label
              onClick={() =>
                setRecipes(
                  Object.values(recipes).find(
                    (value: any) => value.itemID <= 206
                  )
                )
              }
              className="flex cursor-pointer flex-col items-center rounded-md border border-gray-300 bg-white p-1 text-white hover:border-gray-400 dark:border-[#2A2A2A] dark:bg-[#1F1F1F]"
            >
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
              title={`${name} knows how to cook ${knownCount}/80 recipes and has cooked ${cookedCount}/80 recipes.`}
              Icon={InformationCircleIcon}
            />
            <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "cooking")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    additionalDescription={
                      cookedCount >= requirements[achievement.name]
                        ? ""
                        : ` - ${80 - cookedCount} left!`
                    }
                    sourceURL={achievement.iconURL}
                    initialChecked={
                      cookedCount >= requirements[achievement.name]
                    }
                  />
                ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            All Recipes
          </h2>
          {/* Color indicator information */}
          <div className="flex items-center space-x-8">
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20" />
                <p className="text-sm dark:text-white">- Cooked Recipe</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full border border-yellow-900 bg-yellow-500/20" />
                <p className="text-sm dark:text-white">- Known Recipe</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full border border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]" />
                <p className="text-sm dark:text-white">- Unknown Recipe</p>
              </div>
            </div>
          </div>
          {/* End Color indicator information */}
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.values(recipes).map((recipe: any) => (
              <RecipeCard
                key={recipe.itemID}
                category={"cooking"}
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
        category={"cooking"}
        selected={selectedRecipe}
        setOpen={setShowRecipe}
      />
    </>
  );
};

export default Cooking;
