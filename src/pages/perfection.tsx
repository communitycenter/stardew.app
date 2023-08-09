import Head from "next/head";

import fish from "@/data/fish.json";
import villagers from "@/data/villagers.json";
import shippingItems from "@/data/shipping.json";
import cookingRecipes from "@/data/cooking.json";
import craftingRecipes from "@/data/crafting.json";

import { useContext, useMemo } from "react";
import { PlayersContext } from "@/contexts/players-context";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InfoCard } from "@/components/cards/info-card";
import { PercentageIndicator } from "@/components/percentage";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PerfectionCard } from "@/components/cards/perfection-card";

const monsterGoals: Record<string, any> = {
  Slimes: {
    goal: 1000,
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/7/7b/Green_Slime.png",
  },
  "Void Spirits": {
    goal: 150,
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/1/11/Shadow_Shaman.png",
  },
  Bats: {
    goal: 200,
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/d/d5/Iridium_Bat.png",
  },
  Skeletons: {
    goal: 50,
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/2/23/Skeleton.png",
  },
  "Cave Insects": {
    goal: 125,
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/7/7d/Bug.png",
  },
  Duggies: {
    goal: 30,
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/3/3a/Duggy.png",
  },
  "Dust Sprites": {
    goal: 500,
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/9/9a/Dust_Sprite.png",
  },
  "Rock Crabs": {
    goal: 60,
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/d/d4/Rock_Crab.png",
  },
  Mummies: {
    goal: 100,
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/7/70/Mummy.png",
  },
  "Pepper Rex": {
    goal: 50,
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/6/67/Pepper_Rex.png",
  },
  Serpents: {
    goal: 250,
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/8/89/Serpent.png",
  },
  "Magma Sprites": {
    goal: 150,
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/f/f2/Magma_Sprite.png",
  },
};

export default function Perfection() {
  const { activePlayer } = useContext(PlayersContext);

  const craftedCount = useMemo(() => {
    if (!activePlayer) return 0;

    // find all recipes that have a value of 2 (crafted)
    return Object.values(activePlayer.crafting.recipes).filter((r) => r === 2)
      .length;
  }, [activePlayer]);

  // StardewValley.Utility.cs::percentGameComplete()
  const getCraftedRecipesPercent = useMemo(() => {
    // StardewValley.Utility.cs::getCraftedRecipesPercent()
    if (!activePlayer) return 0;

    // TODO: we don't include the wedding ring so no need to -1
    //       but, apparently in multiplayer the wedding ring is required
    //       i can't find the code that does this though
    return craftedCount / Object.keys(craftingRecipes).length;
  }, [activePlayer, craftedCount]);

  const cookedCount = useMemo(() => {
    if (!activePlayer) return 0;

    // find all recipes that have a value of 2 (cooked)
    return Object.values(activePlayer.cooking.recipes).filter((r) => r === 2)
      .length;
  }, [activePlayer]);

  const getCookedRecipesPercent = useMemo(() => {
    // StardewValley.Utility.cs::getCookedRecipesPercent()
    if (!activePlayer) return 0;

    return cookedCount / Object.keys(cookingRecipes).length;
  }, [activePlayer, cookedCount]);

  const getFishCaughtPercent = useMemo(() => {
    // StardewValley.Utility.cs::getFishCaughtPercent()
    if (!activePlayer) return 0;

    const fishCaught = activePlayer.fishing.fishCaught.length;

    return fishCaught / Object.keys(fish).length;
  }, [activePlayer]);

  const getMaxedFrienshipsCount = useMemo(() => {
    if (!activePlayer) return 0;

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
    if (!activePlayer) return 0;

    return getMaxedFrienshipsCount / Object.keys(villagers).length;
  }, [activePlayer, getMaxedFrienshipsCount]);

  const basicShippedCount = useMemo(() => {
    if (!activePlayer) return 0;

    return Object.keys(activePlayer.shipping.shipped).length;
  }, [activePlayer]);

  const getFarmerItemsShippedPercent = useMemo(() => {
    if (!activePlayer) return 0;

    return basicShippedCount / Object.keys(shippingItems).length;
  }, [activePlayer, basicShippedCount]);

  const slayerQuestsCompleted = useMemo(() => {
    if (!activePlayer) return 0;

    let count = 0;
    const monstersKilled = activePlayer.monsters.monstersKilled;

    for (const monster of Object.keys(monstersKilled)) {
      if (monstersKilled[monster] >= monsterGoals[monster].goal) {
        count++;
      }
    }
    return count;
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
          (farming + fishing + foraging + mining + combat) / 2
        );
      }
    }
    return playerLevel;
  }, [activePlayer]);

  const getPercentComplete = useMemo(() => {
    if (!activePlayer) return 0;

    let num = 0;

    num += getFarmerItemsShippedPercent * 15; // 15% of the total
    num += activePlayer.perfection.numObelisks;
    num += activePlayer.perfection.goldenClock ? 10 : 0;
    num += slayerQuestsCompleted >= 12 ? 10 : 0;
    num += getMaxedFriendshipPercent * 11; // 11% of the total
    num += (Math.min(playerLevel, 25) / 25) * 5; // 5% of the total
    num += (activePlayer.general?.stardrops?.length ?? 0) >= 7 ? 10 : 0;
    num += getCookedRecipesPercent * 10; // 10% of the total
    num += getCraftedRecipesPercent * 10; // 10% of the total
    num += getFishCaughtPercent * 10; // 10% of the total
    num += (activePlayer.walnuts.foundCount / 130) * 5;

    return num / 100;
  }, [
    activePlayer,
    getFarmerItemsShippedPercent,
    slayerQuestsCompleted,
    getMaxedFriendshipPercent,
    playerLevel,
    getCookedRecipesPercent,
    getCraftedRecipesPercent,
    getFishCaughtPercent,
  ]);

  return (
    <>
      <Head>
        <title>stardew.app | Perfection Tracker</title>
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
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
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
                  <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-4 grid-rows-4">
                    <Card className="col-span-1 row-span-full w-full flex justify-center items-center">
                      <div className="flex flex-col items-center p-4">
                        <CardHeader className="flex flex-row items-cnter justify-between space-y-0 mb-2 p-0">
                          <CardTitle className="text-2xl font-semibold">
                            Total Perfection
                          </CardTitle>
                        </CardHeader>

                        <PercentageIndicator
                          percentage={Math.floor(getPercentComplete * 100)}
                          className="h-32 w-32 lg:h-48 lg:w-48"
                        />
                      </div>
                    </Card>

                    <PerfectionCard
                      title="Produce & Forage Shipped"
                      description={`${basicShippedCount ?? 0}/145`}
                      percentage={Math.floor(
                        getFarmerItemsShippedPercent * 100
                      )}
                      footer="15% of total perfection"
                    />
                    <PerfectionCard
                      title="Obelisks on Farm"
                      description={`${
                        activePlayer?.perfection.numObelisks ?? 0
                      }/4`}
                      // TODO: do we show 0/100% or incremental percent? in game code its either 0 or 100
                      percentage={
                        ((activePlayer?.perfection.numObelisks ?? 0) / 4) * 100
                      }
                      footer="4% of total perfection"
                    />
                    <PerfectionCard
                      title="Golden Clock on Farm"
                      description={`${
                        activePlayer?.perfection.goldenClock
                          ? "Completed"
                          : "Missing"
                      }`}
                      percentage={
                        activePlayer?.perfection.goldenClock ? 100 : 0
                      }
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Monster Slayer Hero"
                      description={`${slayerQuestsCompleted}/12`}
                      // TODO: do we show 0/100% or incremental percent? in game code its either 0 or 100
                      percentage={Math.floor(slayerQuestsCompleted / 12) * 100}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Great Friends"
                      description={`${getMaxedFrienshipsCount ?? 0}/34`}
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
                          100
                      )}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Cooking Recipes Made"
                      description={`${cookedCount}/80`}
                      percentage={Math.floor(getCookedRecipesPercent * 100)}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Crafting Recipes Made"
                      description={`${craftedCount}/129`}
                      percentage={Math.floor(getCraftedRecipesPercent * 100)}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Fish Caught"
                      description={`${
                        activePlayer?.fishing.fishCaught.length ?? 0
                      }/67`}
                      percentage={Math.floor(getFishCaughtPercent * 100)}
                      footer="10% of total perfection"
                    />
                    <PerfectionCard
                      title="Golden Walnuts"
                      description={`${
                        activePlayer?.walnuts.foundCount ?? 0
                      }/130`}
                      percentage={Math.floor(
                        ((activePlayer?.walnuts.foundCount ?? 0) / 130) * 100
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Object.keys(monsterGoals).map((monster) => (
                <InfoCard
                  key={monster}
                  title={monster}
                  sourceURL={monsterGoals[monster].iconURL}
                  description={`${
                    activePlayer?.monsters.monstersKilled[monster] ?? 0
                  }/${monsterGoals[monster].goal}`}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
