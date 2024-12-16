import Head from "next/head";

import cookingRecipes from "@/data/cooking.json";
import craftingRecipes from "@/data/crafting.json";
import fish from "@/data/fish.json";
import shippingItems from "@/data/shipping.json";
import villagers from "@/data/villagers.json";
import { monsters } from "@/lib/parsers/monsters";
import achievements from "@/data/achievements.json";
import walnuts from "@/data/walnuts.json";

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
  const { activePlayer, players } = usePlayers();

  const toPercent = (count: number, total: number): number => {
    if (total === 0) return 0;
    return Math.floor((count / total) * 100);
  };

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (activePlayer) {
      const goals = new Set(["Protector Of The Valley"]);

      if (goals.has(name)) {
        // use slayerGoalsCount and compare to reqs
        if (slayerGoalsCount >= reqs[name]) completed = true;
        else {
          additionalDescription = ` - ${reqs[name] - slayerGoalsCount} left`;
        }
      }
    }

    return { completed, additionalDescription };
  };

  const groupedFarmers = useMemo(() => {
    if (!players) return [];
    return players.filter((player: any) => player.general.farmInfo === activePlayer?.general?.farmInfo);
  }, [activePlayer, players]);

  const gameVersion = useMemo(() => {
    if (!activePlayer || !activePlayer.general?.gameVersion) return "1.6.0";

    return activePlayer.general.gameVersion;
  }, [activePlayer]);

  const perfectionWaivers = useMemo(() => {
    if (!groupedFarmers || 
      !groupedFarmers.some(player => player.perfection?.perfectionWaivers)) return 0;
  
    const waivers = groupedFarmers
      .map(player => player.perfection?.perfectionWaivers ?? 0);
  
    return Math.max(...waivers);
  }, [groupedFarmers]);

  const [basicShippedCount, basicShippedPercent, totalShipping] = useMemo(() => {
    if (!groupedFarmers ||
      !groupedFarmers.some(player => player.shipping?.shipped)) {
        return [0, 0, Object.keys(shippingItems).length];
    }

    const groupedCount = groupedFarmers
    .map(player => Object.keys(player.shipping?.shipped || {})
    .filter((i) => {
      // exclude clam from the count if the game version is 1.6.0 or higher
      if (i === "372" && semverGte(gameVersion, "1.6.0")) return false;
      return true;
    }).length);

    const count = Math.max(...groupedCount, 0);

    const total =
      Object.values(shippingItems).filter((i) =>
        semverGte(gameVersion, i.minVersion),
      ).length - (semverGte(gameVersion, "1.6.0") ? 1 : 0);

    return [count, toPercent(count, total), total];
  }, [groupedFarmers, gameVersion]);

  const [obelisksCount, obelisksPercent, obelisksTotal] = useMemo(() => {
    const total = 4;

    if (!groupedFarmers ||
      !groupedFarmers.some(player => player.perfection?.numObelisks)) {
        return [0, 0, total];
    }

    const groupedCount = groupedFarmers
      .map(player => player.perfection?.numObelisks ?? 0);

    const count = Math.max(...groupedCount, 0);

    return [count, toPercent(count, total), total];
  }, [groupedFarmers]);

  const [isClockOnFarm, clockPercent] = useMemo(() => {
    if (!groupedFarmers ||
      !groupedFarmers.some(player => player.perfection?.goldenClock)) {
        return [false, 0];
    }

    return [true, 100];
  }, [groupedFarmers]);

  const [slayerGoalsCount, slayerGoalsPercent, totalSlayerGoals] = useMemo(() => {
    const total = Object.keys(monsters).length;
  
    if (!groupedFarmers || !groupedFarmers.some(player => player.monsters?.monstersKilled)) {
      return [0, 0, total];
    }
  
    // Precompute the monster goal counts for quick access
    const goalMap = Object.fromEntries(
      Object.keys(monsters).map(monster => [monster, monsters[monster].count])
    );
  
    const groupedCount = groupedFarmers.map(player => {
      const monstersKilled = player?.monsters?.monstersKilled ?? {};
      let count = 0;

      for (const monster in monstersKilled) {
        if (monstersKilled[monster] >= goalMap[monster]) {
          count++;
        }
      }

      return count;
    });
  
    const count = Math.max(...groupedCount, 0);
  
    return [count, toPercent(count, total), total];
  }, [groupedFarmers]);

  const [maxedFriendshipsCount, maxedFriendshipsPercent, totalFriendships] = useMemo(() => {
    // StardewValley.Utility.cs::getMaxedFriendshipPercent()
    const total = Object.keys(villagers).length;

    if (!groupedFarmers || !groupedFarmers.some(player => player.social?.relationships)) {
      return [0, 0, total];
    }

    const groupedCount = groupedFarmers.map(player => {
      let count = 0;

      for (const name of Object.keys(player.social?.relationships || {})) {
        const { datable } = villagers[name as keyof typeof villagers];
        const friendshipPoints = player.social?.relationships[name].points ?? 0;
  
        // check if hearts are maxed, for non-dateable NPCs its 250 * 10
        // for dateable NPCs its 250 * 8 (doesn't matter if they are dating or not)
        if (friendshipPoints >= (datable ? 250 * 8 : 250 * 10)) count++;
      }

      return count;
    });

    const count = Math.max(...groupedCount, 0);

    return [count, toPercent(count, total), total];
  }, [groupedFarmers]);

  const [playerLevelCount, playerLevelPercent, playerLevelTotal] = useMemo(() => {
    const total = 25;

    const groupedCount = groupedFarmers.map((player) => {
      const { farming = 0, fishing = 0, foraging = 0, mining = 0, combat = 0} 
        = player.general?.skills || {};
      return Math.floor((farming + fishing + foraging + mining + combat) / 2);
    });

    const count = Math.max(...groupedCount, 0);

    return [count, toPercent(count, total), total];
  }, [groupedFarmers]);

  const [stardropsFoundCount, stardropsFoundPercent, stardropsFoundTotal] = useMemo(() => {
    const total = 7;

    if (!groupedFarmers || !groupedFarmers.some(player => player.general?.stardrops)) {
      return [0, 0, total];
    }

    const groupedCount = groupedFarmers
      .map(player => player.general?.stardrops?.length ?? 0);

    const count = Math.max(...groupedCount, 0);

    return [count, toPercent(count, total), total];
  }, [groupedFarmers]);

  const [cookedCount, cookedPercent, totalCooking] = useMemo(() => {
    // StardewValley.Utility.cs::getCookedRecipesPercent()
    if (!groupedFarmers || 
      groupedFarmers.length === 0 || 
      !groupedFarmers.some(player => player.cooking?.recipes)) {
      return [0, 0, Object.keys(cookingRecipes).length];
    }

    // find all recipes that have a value of 2 (cooked)
    const groupedCount: number[] = groupedFarmers
      .map(player => Object.values(player.cooking?.recipes || {})
      .filter(recipeValue => recipeValue === 2).length
    );

    const count = Math.max(...groupedCount, 0);

    const total = Object.values(cookingRecipes).filter((r) =>
      semverGte(gameVersion, r.minVersion),
    ).length;

    return [count, toPercent(count, total), total];
  }, [groupedFarmers, gameVersion]);

  // StardewValley.Utility.cs::percentGameComplete()
  const [craftedCount, craftedPercent, totalCrafting] = useMemo(() => {
    // StardewValley.Utility.cs::getCraftedRecipesPercent()
    if (!groupedFarmers || 
      groupedFarmers.length === 0 || 
      !groupedFarmers.some(player => player.crafting?.recipes)) {
      return [0, 0, Object.keys(craftingRecipes).length];
    }
      
    // find all recipes that have a value of 2 (crafted)
    const groupedCount: number[] = groupedFarmers
      .map(player => Object.values(player.crafting?.recipes || {})
      .filter(recipeValue => recipeValue === 2).length
    );

    const count = Math.max(...groupedCount, 0);

    // total count based on the player's game version
    const total = Object.values(craftingRecipes).filter((r) =>
      semverGte(gameVersion, r.minVersion),
    ).length;

    return [count, toPercent(count, total), total];
  }, [groupedFarmers, gameVersion]);

  const [fishCaughtCount, fishCaughtPercent, totalFish] = useMemo(() => {
    // StardewValley.Utility.cs::getFishCaughtPercent()
    if (!groupedFarmers || 
      groupedFarmers.length === 0 || 
      !groupedFarmers.some(player => player.fishing?.fishCaught)) {
      return [0, 0, Object.keys(fish).length];
    }

    const groupedCount = groupedFarmers
      .map(player => player.fishing?.fishCaught?.length ?? 0);

    const count = Math.max(...groupedCount);

    const total = Object.values(fish).filter((f) =>
      semverGte(gameVersion, f.minVersion),
    ).length;

    return [count, toPercent(count, total), total];
  }, [groupedFarmers, gameVersion]);

  const [walnutsFoundCount, walnutsFoundPercent, totalWalnuts] = useMemo(() => {
    const total = Object.values(walnuts).reduce((ac, items) => ac + items.count, 0);

    if (!groupedFarmers || 
      groupedFarmers.length === 0 || 
      !groupedFarmers.some(player => player.walnuts?.found)) {
      return [0, 0, total];
    }

    const groupedCount = groupedFarmers.map(player => 
      Object.entries(player.walnuts?.found || {}).reduce((a, b) => a + b[1], 0)
    );

    const count = Math.max(...groupedCount, 0);

    return [count, toPercent(count, total), total];
  }, [groupedFarmers]);

  const percentComplete = useMemo(() => {
    // Reference: StardewValley.Utility.cs::percentGameComplete()
    if (!activePlayer) return 0;

    let count = 0;
    let total = 0;

    // The numbers multiplying represent the share of the total
    count += (basicShippedPercent / 100) * 15; 
    total += 15;

    count += obelisksCount;
    total += 4;

    count += isClockOnFarm ? 10 : 0;
    total += 10;

    count += slayerGoalsCount >= totalSlayerGoals ? 10 : 0;
    total += 10;

    count += (maxedFriendshipsPercent / 100) * 11;
    total += 11;

    count += (playerLevelPercent / 100) * 5;
    total += 5;

    count += stardropsFoundCount >= stardropsFoundTotal ? 10 : 0;
    total += 10;

    count += (cookedPercent / 100) * 10;
    total += 10;

    count += (craftedPercent / 100) * 10;
    total += 10;

    count += (fishCaughtPercent / 100) * 10;
    total += 10;

    count += (walnutsFoundPercent / 100) * 5;
    total += 5;

    return toPercent(count, total);
  }, [
    activePlayer,
    basicShippedPercent,
    obelisksCount,
    isClockOnFarm,
    slayerGoalsCount,
    totalSlayerGoals,
    maxedFriendshipsPercent,
    playerLevelPercent,
    stardropsFoundCount,
    stardropsFoundTotal,
    cookedPercent,
    craftedPercent,
    fishCaughtPercent,
    walnutsFoundPercent,
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
        className={`flex min-h-screen flex-col items-center px-5 pb-8 pt-2 md:px-8`}
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
                  {"Farm's Perfection Goals"}
                </AccordionTrigger>
                <AccordionContent asChild>
                  <div className="grid grid-cols-1 grid-rows-4 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                    <Card
                      className={cn(
                        "col-span-1 row-span-full flex w-full items-center justify-center",
                        percentComplete === 1 &&
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
                              {Math.min(percentComplete + perfectionWaivers, 100)}
                              % with {perfectionWaivers} perfection waiver{perfectionWaivers > 1 ? "s" : ""}
                            </CardDescription>
                          )}
                        </CardHeader>

                        <PercentageIndicator
                          percentage={percentComplete}
                          className="h-32 w-32 lg:h-48 lg:w-48"
                        />
                      </div>
                    </Card>

                    <PerfectionCard
                      title="Produce & Forage Shipped"
                      description={`${basicShippedCount}/${totalShipping}`}
                      percentage={basicShippedPercent}
                      footer="15% of total perfection"
                    />
                    <PerfectionCard
                      title="Obelisks on Farm"
                      description={`${obelisksCount}/${obelisksTotal}`}
                      percentage={obelisksPercent}
                      footer="4% of total perfection"
                    />
                    <PerfectionCard
                      title="Golden Clock on Farm"
                      description={`${isClockOnFarm
                          ? "Completed"
                          : "Missing"
                      }`}
                      percentage={clockPercent}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Monster Slayer Hero"
                      description={`${slayerGoalsCount}/${totalSlayerGoals}`}
                      percentage={slayerGoalsPercent}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Great Friends"
                      description={`${maxedFriendshipsCount}/${totalFriendships}`}
                      percentage={maxedFriendshipsPercent}
                      footer="11% of total perfection"
                    />
                    <PerfectionCard
                      title="Farmer Level"
                      description={`${playerLevelCount}/${playerLevelTotal}`}
                      percentage={playerLevelPercent}
                      footer="5% of total perfection"
                    />
                    <PerfectionCard
                      title="Stardrops Found"
                      description={`${stardropsFoundCount}/${stardropsFoundTotal}`}
                      percentage={stardropsFoundPercent}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Cooking Recipes Made"
                      description={`${cookedCount}/${totalCooking}`}
                      percentage={cookedPercent}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Crafting Recipes Made"
                      description={`${craftedCount}/${totalCrafting}`}
                      percentage={craftedPercent}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Fish Caught"
                      description={`${fishCaughtCount}/${totalFish}`}
                      percentage={fishCaughtPercent}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Golden Walnuts Found"
                      description={`${walnutsFoundCount}/${totalWalnuts}`}
                      percentage={walnutsFoundPercent}
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
