import type { NextPage } from "next";
import type { CookingRecipe } from "../types";

import achievements from "../research/processors/data/achievements.json";
import cooking_recipes from "../research/processors/data/cooking_recipes.json";

import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import SidebarLayout from "../components/sidebarlayout";
import RecipeCard from "../components/cards/recipecard";
import RecipeSlideOver from "../components/slideovers/recipeslideover";
import FilterBtn from "../components/filterbtn";

import { useState } from "react";
import { useKV } from "../hooks/useKV";
import { useCategory } from "../utils/useCategory";
import Head from "next/head";

import { InformationCircleIcon } from "@heroicons/react/solid";

// a mapping of achievements and their requirements
const requirements: Record<string, number> = {
  Cook: 10,
  "Sous Chef": 25,
  "Gourmet Chef": 80,
};

const Cooking: NextPage = () => {
  const { data, error, isLoading } = useCategory("cooking", "number");
  const [_filter, setFilter] = useState<string>("off");

  const [hasUploaded] = useKV<boolean>("general", "uploadedFile", false);

  const [name] = useKV("general", "name", "Farmer");
  const [cookedCount, setCookedCount] = useKV("cooking", "cookedCount", 0);
  const [knownCount, setKnownCount] = useKV("cooking", "knownCount", 0);

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
        <meta
          name="og:description"
          content="Track your Stardew Valley cooking recipe progress. See what recipes you need to cook for 100% completion on Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your Stardew Valley cooking recipe progress. See what recipes you need to cook for 100% completion on Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley cooking tracker, stardew valley, stardew, stardew checkup, stardew cooking, stardew 100% completion, stardew perfection tracker, stardew, valley, cook stardew valley"
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
                        : ` - ${
                            requirements[achievement.name] - cookedCount
                          } left!`
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
            {_filter === "off"
              ? "All Recipes"
              : {
                  "0": "Unknown Recipe",
                  "1": "Known Recipe",
                  "2": "Cooked Recipe",
                }[_filter]}
          </h2>

          {/* Filter Buttons */}
          <div className="mt-2 flex items-center space-x-4">
            <FilterBtn
              _filter={_filter}
              setFilter={setFilter}
              targetState="2"
              title="Cooked Recipe"
            />
            <FilterBtn
              _filter={_filter}
              setFilter={setFilter}
              targetState="1"
              title="Known Recipe"
            />
            <FilterBtn
              _filter={_filter}
              setFilter={setFilter}
              targetState="0"
              title="Unknown Recipe"
            />
          </div>
          {/* End Filter Buttons */}

          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Object.values(cooking_recipes).map((recipe: any) => (
                  <RecipeCard
                    key={recipe.itemID}
                    category={"cooking"}
                    recipe={recipe}
                    setSelectedRecipe={setSelectedRecipe}
                    setShowRecipe={setShowRecipe}
                    setKnownCount={setKnownCount}
                    setCompletedCount={setCookedCount}
                  />
                ))
              : Object.keys(data)
                  .filter((key) => {
                    if (_filter === "off") {
                      return true;
                    } else {
                      return data[key] === JSON.parse(_filter);
                    }
                  })
                  .map((recipeID) => (
                    <RecipeCard
                      key={recipeID}
                      category="cooking"
                      recipe={
                        cooking_recipes[
                          recipeID as keyof typeof cooking_recipes
                        ]
                      }
                      setSelectedRecipe={setSelectedRecipe}
                      setShowRecipe={setShowRecipe}
                      setKnownCount={setKnownCount}
                      setCompletedCount={setCookedCount}
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
        setKnownCount={setKnownCount}
        setCompletedCount={setCookedCount}
      />
    </>
  );
};

export default Cooking;
