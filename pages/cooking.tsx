import type { NextPage } from "next";
import type { CookingRecipe } from "../types/cookingRecipes";

import achievements from "../research/processors/data/achievements.json";
import cooking_recipes from "../research/processors/data/cooking_recipes.json";

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
  Cook: 10,
  "Sous Chef": 25,
  "Gourmet Chef": 80,
};

const Cooking: NextPage = () => {
  const [recipes, setRecipes] = useState<any>(cooking_recipes);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showRecipe, setShowRecipe] = useState<boolean>(false);

  const [name] = useKV("general", "name", "Farmer");
  const [totalRecipesCooked] = useKV("cooking", "cookedRecipesCount", 0);
  const [knownRecipesCount] = useKV("cooking", "knownRecipesCount", 0);

  const [selectedRecipe, setSelectedRecipe] = useState<CookingRecipe>(
    Object.values(cooking_recipes)[0]
  );

  const [hasUploaded] = useKV<boolean>("general", "user", false);

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
              title={`${name} knows how to cook ${knownRecipesCount}/80 recipes and has cooked ${totalRecipesCooked}/80 recipes.`}
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
                      totalRecipesCooked >= requirements[achievement.name]
                        ? ""
                        : ` - ${80 - totalRecipesCooked} left!`
                    }
                    sourceURL={achievement.iconURL}
                    initialChecked={
                      totalRecipesCooked >= requirements[achievement.name]
                    }
                  />
                ))}
            </div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            All Recipes
          </h2>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.values(recipes).map((recipe: any) => (
              <RecipeCard
                key={recipe.itemID}
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

export default Cooking;
