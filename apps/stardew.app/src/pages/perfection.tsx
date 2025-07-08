import Head from "next/head";

import cookingRecipes from "@/data/cooking.json";
import craftingRecipes from "@/data/crafting.json";
import fish from "@/data/fish.json";
import shippingItems from "@/data/shipping.json";
import villagers from "@/data/villagers.json";
import { monsters } from "@/lib/parsers/monsters";
import achievements from "@/data/achievements.json";

import { usePlayers } from "@/contexts/players-context";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { InputCard } from "@/components/cards/input-card";
import { PerfectionCard } from "@/components/cards/perfection-card";
import { PercentageIndicator } from "@/components/percentage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const reqs: Record<string, number> = {
  "Protector Of The Valley": Object.keys(monsters).length,
};

const semverGte = require("semver/functions/gte");

export default function Perfection() {
  const { activePlayer } = usePlayers();

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (activePlayer) {
      const goals = new Set(["Protector Of The Valley"]);

      if (goals.has(name)) {
        // use slayerQuestsCompleted and compare to reqs
        if (slayerQuestsCompleted >= reqs[name]) completed = true;
        else {
          additionalDescription = ` - ${reqs[name] - slayerQuestsCompleted} left`;
        }
      }
    }

    return { completed, additionalDescription };
  };

  const gameVersion = useMemo(() => {
    if (!activePlayer || !activePlayer.general?.gameVersion) return "1.6.0";

    return activePlayer.general.gameVersion;
  }, [activePlayer]);

  const perfectionWaivers = useMemo(() => {
    if (!activePlayer || !activePlayer.perfection?.perfectionWaivers) return 0;

    return activePlayer.perfection.perfectionWaivers;
  }, [activePlayer]);

  const craftedCount = useMemo(() => {
    if (!activePlayer || !activePlayer.crafting?.recipes) return 0;

    // find all recipes that have a value of 2 (crafted)
    return Object.values(activePlayer.crafting.recipes).filter((r) => r === 2)
      .length;
  }, [activePlayer]);

  // StardewValley.Utility.cs::percentGameComplete()
  const [getCraftedRecipesPercent, totalCrafting] = useMemo(() => {
    // StardewValley.Utility.cs::getCraftedRecipesPercent()
    if (!activePlayer || !activePlayer.crafting?.recipes)
      return [0, Object.keys(craftingRecipes).length];

    // TODO: we don't include the wedding ring so no need to -1
    //       but, apparently in multiplayer the wedding ring is required
    //       i can't find the code that does this though

    // total count based on the player's game version
    const totalCrafting = Object.values(craftingRecipes).filter((r) =>
      semverGte(gameVersion, r.minVersion),
    ).length;

    return [craftedCount / totalCrafting, totalCrafting];
  }, [activePlayer, craftedCount, gameVersion]);

  const cookedCount = useMemo(() => {
    if (!activePlayer || !activePlayer.cooking?.recipes) return 0;

    // find all recipes that have a value of 2 (cooked)
    return Object.values(activePlayer.cooking.recipes).filter((r) => r === 2)
      .length;
  }, [activePlayer]);

  const [getCookedRecipesPercent, totalCooking] = useMemo(() => {
    // StardewValley.Utility.cs::getCookedRecipesPercent()
    if (!activePlayer || !activePlayer.cooking?.recipes)
      return [0, Object.keys(cookingRecipes).length];

    const totalCooking = Object.values(cookingRecipes).filter((r) =>
      semverGte(gameVersion, r.minVersion),
    ).length;

    return [cookedCount / totalCooking, totalCooking];
  }, [activePlayer, cookedCount, gameVersion]);

  const [getFishCaughtPercent, totalFish] = useMemo(() => {
    // StardewValley.Utility.cs::getFishCaughtPercent()
    if (!activePlayer || !activePlayer.fishing?.fishCaught)
      return [0, Object.keys(fish).length];

    const fishCaught = activePlayer?.fishing?.fishCaught?.length ?? 0;
    const totalFish = Object.values(fish).filter((f) =>
      semverGte(gameVersion, f.minVersion),
    ).length;

    return [fishCaught / totalFish, totalFish];
  }, [activePlayer, gameVersion]);

  const getMaxedFrienshipsCount = useMemo(() => {
    if (!activePlayer || !activePlayer.social?.relationships) return 0;

    let maxedFriendships = 0;
    for (const key of Object.keys(activePlayer.social.relationships)) {
      const name = key as keyof typeof villagers;
      const isDateable = villagers[name].datable;
      const friendshipPoints = activePlayer.social.relationships[name].points;

      // check if hearts are maxed, for non-dateable NPCs its 250 * 10
      // for dateable NPCs its 250 * 8 (doesn't matter if they are dating or not)
      if (friendshipPoints >= (isDateable ? 250 * 8 : 250 * 10))
        maxedFriendships++;
    }
    return maxedFriendships;
  }, [activePlayer]);

  const getMaxedFriendshipPercent = useMemo(() => {
    // StardewValley.Utility.cs::getMaxedFriendshipPercent()
    if (!activePlayer || !activePlayer.social?.relationships) return 0;

    return getMaxedFrienshipsCount / Object.keys(villagers).length;
  }, [activePlayer, getMaxedFrienshipsCount]);

  const basicShippedCount = useMemo(() => {
    if (!activePlayer || !activePlayer.shipping?.shipped) return 0;

    return Object.keys(activePlayer.shipping.shipped).filter((i) => {
      // exclude clam from the count if the game version is 1.6.0 or higher
      if (i === "372" && semverGte(gameVersion, "1.6.0")) return false;
      return true;
    }).length;
  }, [activePlayer, gameVersion]);

  const [getFarmerItemsShippedPercent, totalShipping] = useMemo(() => {
    if (!activePlayer || !activePlayer.shipping?.shipped)
      return [0, Object.keys(shippingItems).length];

    const totalShipping =
      Object.values(shippingItems).filter((i) =>
        semverGte(gameVersion, i.minVersion),
      ).length - (semverGte(gameVersion, "1.6.0") ? 1 : 0);

    return [basicShippedCount / totalShipping, totalShipping];
  }, [activePlayer, basicShippedCount, gameVersion]);

  // TODO: use Data/MonsterSlayerQuests.json to get the number of quests
  const slayerQuestsCompleted = useMemo(() => {
    if (!activePlayer || !activePlayer.monsters?.monstersKilled) return 0;

    let count = 0;
    const monstersKilled = activePlayer?.monsters?.monstersKilled ?? {};

    for (const monster of Object.keys(monstersKilled)) {
      if (monstersKilled[monster] >= monsters[monster].count) {
        count++;
      }
    }
    return count;
  }, [activePlayer]);

  const getWalnutsFound = useMemo(() => {
    if (!activePlayer || !activePlayer.walnuts?.found) return 0;

    const walnutsFoundObject = activePlayer?.walnuts?.found ?? {};

    return Object.entries(walnutsFoundObject).reduce((a, b) => a + b[1], 0);
  }, [activePlayer]);

  const playerLevel = useMemo(() => {
    // formula for player level is
    // (farmingLevel + fishingLevel + foragingLevel + miningLevel + combatLevel + luckLevel) / 2
    let playerLevel = 0;
    if (activePlayer) {
      // luck is unused as of 1.5
      if (activePlayer.general?.skills) {
        const { farming, fishing, foraging, mining, combat } =
          activePlayer.general.skills;

        playerLevel = Math.floor(
          (farming + fishing + foraging + mining + combat) / 2,
        );
      }
    }
    return playerLevel;
  }, [activePlayer]);

  const getPercentComplete = useMemo(() => {
    // Reference: StardewValley.Utility.cs::percentGameComplete()
    if (!activePlayer) return 0;

    let num = 0;
    let total = 0;

    num += getFarmerItemsShippedPercent * 15; // 15% of the total
    total += 15;

    num += activePlayer.perfection?.numObelisks ?? 0;
    total += 4;

    num += activePlayer.perfection?.goldenClock ? 10 : 0;
    total += 10;

    num += slayerQuestsCompleted >= Object.keys(monsters).length ? 10 : 0;
    total += 10;

    num += getMaxedFriendshipPercent * 11; // 11% of the total
    total += 11;

    num += (Math.min(playerLevel, 25) / 25) * 5; // 5% of the total
    total += 5;

    num += (activePlayer.general?.stardrops?.length ?? 0) >= 7 ? 10 : 0;
    total += 10;

    num += getCookedRecipesPercent * 10; // 10% of the total
    total += 10;

    num += getCraftedRecipesPercent * 10; // 10% of the total
    total += 10;

    num += getFishCaughtPercent * 10; // 10% of the total
    total += 10;

    num += (getWalnutsFound / 130) * 5;
    total += 5;

    return num / total;
  }, [
    activePlayer,
    getFarmerItemsShippedPercent,
    slayerQuestsCompleted,
    getMaxedFriendshipPercent,
    playerLevel,
    getCookedRecipesPercent,
    getCraftedRecipesPercent,
    getFishCaughtPercent,
    getWalnutsFound,
  ]);

  return (
    <>
      <Head>
        <title>stardew.app | Perfection</title>
        <meta
          name="title"
          content="Stardew Valley 1.6 Perfection Tracker | stardew.app"
        />
        <meta
          name="description"
          content="Track and optimize your progress towards achieving perfection in Stardew Valley. Monitor your farm, relationships, achievements, and community events. Maximize efficiency, uncover secrets, and strive for the ultimate 100% completion. Take control of your Stardew Valley journey and become a true perfectionist."
        />
        <meta
          name="og:description"
          content="Track and optimize your progress towards achieving perfection in Stardew Valley. Monitor your farm, relationships, achievements, and community events. Maximize efficiency, uncover secrets, and strive for the ultimate 100% completion. Take control of your Stardew Valley journey and become a true perfectionist."
        />
        <meta
          name="twitter:description"
          content="Track and optimize your progress towards achieving perfection in Stardew Valley. Monitor your farm, relationships, achievements, and community events. Maximize efficiency, uncover secrets, and strive for the ultimate 100% completion. Take control of your Stardew Valley journey and become a true perfectionist."
        />
        <meta
          name="keywords"
          content="stardew valley perfection tracker, stardew valley perfectionist, stardew valley 100% completion, stardew valley progress tracker, stardew valley farm tracker, stardew valley relationships, stardew valley achievements, stardew valley community events, stardew valley secrets, stardew valley efficiency, stardew valley gameplay tracker, stardew valley, stardew, perfection tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Perfection Tracker
          </h1>
          {/* Perfection Goals */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
                  Perfection Goals
                </AccordionTrigger>
                <AccordionContent asChild>
                  <div className="grid grid-cols-1 grid-rows-4 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                    <Card
                      className={cn(
                        "col-span-1 row-span-full flex w-full items-center justify-center",
                        getPercentComplete === 1 &&
                          "border-green-900 bg-green-500/20 dark:border-green-900 dark:bg-green-500/10",
                      )}
                    >
                      <div className="flex flex-col items-center p-4">
                        <CardHeader className="mb-2 flex flex-col items-center justify-between space-y-0 p-0">
                          <CardTitle className="text-2xl font-semibold">
                            Total Perfection
                          </CardTitle>
                          {perfectionWaivers > 0 && (
                            <CardDescription>
                              {Math.min(
                                Math.floor(getPercentComplete * 100) +
                                  perfectionWaivers,
                                100,
                              )}
                              % with {perfectionWaivers} waiver
                              {perfectionWaivers > 1 ? "s" : ""}
                            </CardDescription>
                          )}
                        </CardHeader>

                        <PercentageIndicator
                          percentage={Math.floor(getPercentComplete * 100)}
                          className="h-32 w-32 lg:h-48 lg:w-48"
                        />
                      </div>
                    </Card>

                    <PerfectionCard
                      title="Produce & Forage Shipped"
                      description={`${basicShippedCount ?? 0}/${totalShipping}`}
                      percentage={Math.floor(
                        getFarmerItemsShippedPercent * 100,
                      )}
                      footer="15% of total perfection"
                    />
                    <PerfectionCard
                      title="Obelisks on Farm"
                      description={`${
                        activePlayer?.perfection?.numObelisks ?? 0
                      }/4`}
                      // TODO: do we show 0/100% or incremental percent? in game code its either 0 or 100
                      percentage={
                        ((activePlayer?.perfection?.numObelisks ?? 0) / 4) * 100
                      }
                      footer="4% of total perfection"
                    />
                    <PerfectionCard
                      title="Golden Clock on Farm"
                      description={`${
                        activePlayer?.perfection?.goldenClock
                          ? "Completed"
                          : "Missing"
                      }`}
                      percentage={
                        activePlayer?.perfection?.goldenClock ? 100 : 0
                      }
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Monster Slayer Hero"
                      // TODO: use Data/MonsterSlayerQuests.json to get the number of quests
                      description={`${slayerQuestsCompleted}/12`}
                      // TODO: do we show 0/100% or incremental percent? in game code its either 0 or 100
                      percentage={Math.floor(slayerQuestsCompleted / 12) * 100}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Great Friends"
                      description={`${getMaxedFrienshipsCount ?? 0}/${
                        Object.keys(villagers).length
                      }`}
                      percentage={Math.floor(getMaxedFriendshipPercent * 100)}
                      footer="11% of total perfection"
                    />
                    <PerfectionCard
                      title="Farmer Level"
                      description={`${playerLevel}/25`}
                      percentage={Math.floor(((playerLevel ?? 0) / 25) * 100)}
                      footer="5% of total perfection"
                    />
                    <PerfectionCard
                      title="Stardrops"
                      description={`${
                        activePlayer?.general?.stardrops?.length ?? 0
                      }/7`}
                      // TODO: do we show 0/100% or incremental percent? in game code its either 0 or 100
                      percentage={Math.floor(
                        ((activePlayer?.general?.stardrops?.length ?? 0) / 7) *
                          100,
                      )}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Cooking Recipes Made"
                      description={`${cookedCount}/${totalCooking}`}
                      percentage={Math.floor(getCookedRecipesPercent * 100)}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Crafting Recipes Made"
                      description={`${craftedCount}/${totalCrafting}`}
                      percentage={Math.floor(getCraftedRecipesPercent * 100)}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Fish Caught"
                      description={`${
                        activePlayer?.fishing?.fishCaught?.length ?? 0
                      }/${totalFish}`}
                      percentage={Math.floor(getFishCaughtPercent * 100)}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Golden Walnuts"
                      description={`${getWalnutsFound ?? 0}/130`}
                      percentage={Math.floor(
                        ((getWalnutsFound ?? 0) / 130) * 100,
                      )}
                      footer="5% of total perfection"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Monster Slayer Goals */}
          <section className="space-y-3">
            <h3 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              Monster Slayer Goals
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              {Object.values(achievements)
                .filter((achievement) =>
                  achievement.description.includes("goals"),
                )
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.keys(monsters).map((group) => (
                <InputCard
                  key={group}
                  title={group}
                  currentValue={activePlayer?.monsters?.monstersKilled?.[group]}
                  completed={
                    (activePlayer?.monsters?.monstersKilled?.[group] ?? 0) >=
                    monsters[group].count
                  }
                  targets={monsters[group].targets}
                  maxValue={monsters[group].count}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
