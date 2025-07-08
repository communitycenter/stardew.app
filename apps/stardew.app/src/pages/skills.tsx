import Head from "next/head";

import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";
import { useMemo, useState } from "react";

import achievements from "@/data/achievements.json";
import powers from "@/data/powers.json";

import { AchievementCard } from "@/components/cards/achievement-card";
import { InfoCard } from "@/components/cards/info-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DialogCard } from "@/components/cards/dialog-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { Progress } from "@/components/ui/progress";
import {
  getCurrentMasteryLevel,
  getMasteryExpNeededForLevel,
} from "@/lib/utils";

const reqs: Record<string, number> = {
  "Singular Talent": 1, // platform specific
  "Master Of The Five Ways": 5, // platform specific
  "Well-Read": 19,
};

export default function SkillsMasteryPowers() {
  const { activePlayer } = usePlayers();

  // unblur dialog
  const [showPrompt, setPromptOpen] = useState(false);
  const { show, toggleShow } = usePreferences();

  const getAchievementProgress = (name: string) => {
    let completed = false;
    let additionalDescription = "";

    if (activePlayer) {
      const skills = new Set(["Singular Talent", "Master Of The Five Ways"]);
      const powers = new Set(["Well-Read"]);

      if (skills.has(name)) {
        // use maxLevelCount and compare to reqs
        if (maxLevelCount >= reqs[name]) completed = true;
        else {
          additionalDescription = ` - ${reqs[name] - maxLevelCount} left`;
        }
      } else if (powers.has(name)) {
        // use the size of playerPowers and compare to reqs
        if (playerPowers.size >= reqs[name]) completed = true;
        else {
          additionalDescription = ` - ${reqs[name] - playerPowers.size} left`;
        }
      }
    }

    return { completed, additionalDescription };
  };

  const maxLevelCount = useMemo(() => {
    // count how many skills the player has at level 10 (max)
    let maxLevelCount = 0;
    if (activePlayer) {
      if (activePlayer.general?.skills) {
        // iterate over each skill and count how many are at level 10
        Object.values(activePlayer.general.skills).forEach((skill) => {
          if (skill >= 10) maxLevelCount++;
        });
      }
    }
    return maxLevelCount;
  }, [activePlayer]);

  const playerExperiencePoints = useMemo(() => {
    const experienceRequired: { [key: number]: number } = {
      1: 100,
      2: 380,
      3: 770,
      4: 1300,
      5: 2150,
      6: 3300,
      7: 4800,
      8: 6900,
      9: 10000,
      10: 15000,
    };

    type SkillName =
      | "farming"
      | "fishing"
      | "foraging"
      | "mining"
      | "combat"
      | "mastery";

    function calculateExperience(skillName: SkillName, activePlayer: any): any {
      const currentLevel = activePlayer?.general?.skills?.[skillName] || 0;
      const currentExperience =
        activePlayer?.general?.experience?.[skillName] || 0;
      const nextLevelExperience = experienceRequired[currentLevel + 1] || 0;

      return {
        percentage:
          currentLevel >= 10
            ? 100
            : Math.floor((currentExperience / nextLevelExperience) * 100),
        experiencePointsRemaining: Math.max(
          nextLevelExperience - currentExperience,
          0,
        ),
        experiencePointsRequired: nextLevelExperience,
      };
    }

    if (activePlayer?.general?.experience && activePlayer?.general?.skills) {
      return {
        farming: calculateExperience("farming", activePlayer),
        fishing: calculateExperience("fishing", activePlayer),
        foraging: calculateExperience("foraging", activePlayer),
        mining: calculateExperience("mining", activePlayer),
        combat: calculateExperience("combat", activePlayer),
      };
    } else {
      return {
        farming: 0,
        fishing: 0,
        foraging: 0,
        mining: 0,
        combat: 0,
      };
    }
  }, [activePlayer]);

  const playerPowers = useMemo(() => {
    if (!activePlayer || !activePlayer.powers?.collection)
      return new Set<string>();

    const playerPowers = activePlayer.powers.collection;

    return new Set<string>(playerPowers);
  }, [activePlayer]);

  const masteryExp = useMemo(() => {
    if (!activePlayer || !activePlayer.powers?.MasteryExp)
      return {
        level: 0,
        percentage: 0,
        experiencePointsRemaining: 0,
        experiencePointsRequired: 0,
      };

    const playerPowers = activePlayer.powers.MasteryExp;

    const masteryLevel = getCurrentMasteryLevel(playerPowers);
    const nextLevelExperience = getMasteryExpNeededForLevel(masteryLevel + 1);
    const currentExperience =
      playerPowers - getMasteryExpNeededForLevel(masteryLevel);

    if (activePlayer.powers.MasteryExp) {
      return {
        level: masteryLevel,
        percentage:
          masteryLevel >= 5
            ? 100
            : (currentExperience / nextLevelExperience) * 100,
        experiencePointsRemaining: Math.max(
          nextLevelExperience - currentExperience,
          0,
        ),
        experiencePointsRequired: nextLevelExperience,
      };
    } else {
      return {
        level: 0,
        percentage: 0,
        experiencePointsRemaining: 0,
        experiencePointsRequired: 0,
      };
    }
  }, [activePlayer]);

  return (
    <>
      <Head>
        <title>stardew.app | Skills & Mastery</title>
        <meta
          name="title"
          content="Stardew Valley 1.6 Skills & Mastery | stardew.app"
        />
        <meta
          name="description"
          content="Track your progress towards achieving mastery in Stardew Valley 1.6, including skill achievements, special items, and powers. See your progress towards mastering all the skills and unlocking valuable rewards in the game."
        />
        <meta
          name="og:description"
          content="Track your progress towards achieving mastery in Stardew Valley 1.6, including skill achievements, special items, and powers. See your progress towards mastering all the skills and unlocking valuable rewards in the game."
        />
        <meta
          name="twitter:description"
          content="Track your progress towards achieving mastery in Stardew Valley 1.6, including skill achievements, special items, and powers. See your progress towards mastering all the skills and unlocking valuable rewards in the game."
        />
        <meta
          name="keywords"
          content="stardew valley, stardew valley special items, stardew valley powers, stardew valley 1.6 special items, stardew valley 1.6 powers, stardew valley 1.6 mastery, stardew valley 1.6 farming mastery, stardew valley 1.6 fishing mastery, stardew valley 1.6 foraging mastery, stardew valley 1.6 mining mastery, stardew valley 1.6 combat mastery, stardew valley 1.6 mastery exp, stardew valley 1.6 skill achievements, stardew valley 1.6 skill achievements progress, stardew valley 1.6 skill achievements tracker, stardew valley 1.6 skill achievements guide"
        />
      </Head>
      <main
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          {/* Skills */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
                  Skills
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {Object.values(achievements)
                        .filter((achievement) =>
                          achievement.description.includes("skill"),
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
                    <div className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-3 xl:grid-cols-6">
                      <InfoCard
                        title="Farming"
                        description={`Level ${
                          activePlayer?.general?.skills?.farming ?? 0
                        }`}
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/8/82/Farming_Skill_Icon.png"
                      >
                        {playerExperiencePoints && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Progress
                                  value={
                                    playerExperiencePoints.farming.percentage
                                  }
                                  max={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {playerExperiencePoints.farming
                                  .experiencePointsRemaining === 0 &&
                                playerExperiencePoints.farming.percentage ===
                                  100
                                  ? "Max level"
                                  : `${playerExperiencePoints.farming.experiencePointsRemaining} XP remaining`}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </InfoCard>
                      <InfoCard
                        title="Fishing"
                        description={`Level ${
                          activePlayer?.general?.skills?.fishing ?? 0
                        } `}
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/e/e7/Fishing_Skill_Icon.png"
                      >
                        {playerExperiencePoints && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Progress
                                  value={
                                    playerExperiencePoints.fishing.percentage
                                  }
                                  max={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {playerExperiencePoints.fishing
                                  .experiencePointsRemaining === 0 &&
                                playerExperiencePoints.fishing.percentage ===
                                  100
                                  ? "Max level"
                                  : `${playerExperiencePoints.fishing.experiencePointsRemaining} XP remaining`}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </InfoCard>
                      <InfoCard
                        title="Foraging"
                        description={`Level ${
                          activePlayer?.general?.skills?.foraging ?? 0
                        }`}
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/f/f1/Foraging_Skill_Icon.png"
                      >
                        {playerExperiencePoints && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Progress
                                  value={
                                    playerExperiencePoints.foraging.percentage
                                  }
                                  max={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {playerExperiencePoints.foraging
                                  .experiencePointsRemaining === 0 &&
                                playerExperiencePoints.foraging.percentage ===
                                  100
                                  ? "Max level"
                                  : `${playerExperiencePoints.foraging.experiencePointsRemaining} XP remaining`}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </InfoCard>
                      <InfoCard
                        title="Mining"
                        description={`Level ${
                          activePlayer?.general?.skills?.mining ?? 0
                        }`}
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/2/2f/Mining_Skill_Icon.png"
                      >
                        {playerExperiencePoints && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Progress
                                  value={
                                    playerExperiencePoints.mining.percentage
                                  }
                                  max={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {playerExperiencePoints.mining
                                  .experiencePointsRemaining === 0 &&
                                playerExperiencePoints.mining.percentage === 100
                                  ? "Max level"
                                  : `${playerExperiencePoints.mining.experiencePointsRemaining} XP remaining`}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </InfoCard>
                      <InfoCard
                        title="Combat"
                        description={`Level ${
                          activePlayer?.general?.skills?.combat ?? 0
                        }`}
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/c/cf/Combat_Skill_Icon.png"
                      >
                        {playerExperiencePoints && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Progress
                                  value={
                                    playerExperiencePoints.combat.percentage
                                  }
                                  max={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {playerExperiencePoints.combat
                                  .experiencePointsRemaining === 0 &&
                                playerExperiencePoints.combat.percentage === 100
                                  ? "Max level"
                                  : `${playerExperiencePoints.combat.experiencePointsRemaining} XP remaining`}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </InfoCard>
                      <InfoCard
                        title="Mastery"
                        description={`Level ${masteryExp.level ?? 0}`}
                        sourceURL="https://cdn.stardew.app/images/(POWER)Mastery_Farming.webp"
                        minVersion="1.6.0"
                        show={show || masteryExp.level > 0}
                      >
                        {playerExperiencePoints && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Progress
                                  value={masteryExp.percentage}
                                  max={100}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {masteryExp.level === 5
                                  ? "Max level"
                                  : `${masteryExp.experiencePointsRemaining} XP remaining`}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </InfoCard>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Special Items */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
                  Special Items
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                      {Object.entries(powers)
                        .filter(
                          ([key, power]) =>
                            !key.includes("Book_") && !key.includes("Mastery_"),
                        )
                        .map(([key, power]) => {
                          return (
                            <DialogCard
                              _type="power"
                              _id={key}
                              setPromptOpen={setPromptOpen}
                              completed={playerPowers.has(key)}
                              key={key}
                              title={power.name}
                              description={power.description ?? "???"}
                              iconURL={`https://cdn.stardew.app/images/(POWER)${key}.webp`}
                              show={show}
                            />
                          );
                        })}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Powers */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1" className="relative">
                <AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
                  Powers
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                      {Object.values(achievements)
                        .filter((achievement) =>
                          achievement.description.includes("power book"),
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
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                      {Object.entries(powers)
                        .filter(([key, power]) => key.includes("Book_"))
                        .map(([key, power]) => {
                          return (
                            <DialogCard
                              _type="power"
                              _id={key}
                              setPromptOpen={setPromptOpen}
                              completed={playerPowers.has(key)}
                              key={key}
                              title={power.name}
                              description={power.description ?? "???"}
                              iconURL={`https://cdn.stardew.app/images/(POWER)${key}.webp`}
                              show={show}
                            />
                          );
                        })}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Mastery */}
          <section className="space-y-3">
            <h3 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              Mastery
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-5">
                {Object.entries(powers)
                  .filter(([key, power]) => key.includes("Mastery_"))
                  .map(([key, power]) => {
                    return (
                      <DialogCard
                        _type="power"
                        _id={key}
                        completed={playerPowers.has(key)}
                        key={key}
                        title={power.name}
                        description={power.description ?? "???"}
                        iconURL={`https://cdn.stardew.app/images/(POWER)${key}.webp`}
                        show={show}
                        setPromptOpen={setPromptOpen}
                      />
                    );
                  })}
              </div>
            </div>
          </section>
        </div>
      </main>
      <UnblurDialog
        open={showPrompt}
        setOpen={setPromptOpen}
        toggleShow={toggleShow}
      />
    </>
  );
}
