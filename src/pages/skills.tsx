import Head from "next/head";

import { useMemo, useState } from "react";
import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";

import achievements from "@/data/achievements.json";
import powers from "@/data/powers.json";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AchievementCard } from "@/components/cards/achievement-card";
import { InfoCard } from "@/components/cards/info-card";

import { DialogCard } from "@/components/cards/dialog-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { Progress } from "@/components/ui/progress";

const reqs: Record<string, number> = {
  "Singular Talent": 1, // platform specific
  "Master Of The Five Ways": 5, // platform specific
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
      const quests = new Set(["Gofer", "A Big Help"]);

      if (skills.has(name)) {
        // use maxLevelCount and compare to reqs
        if (maxLevelCount >= reqs[name]) completed = true;
        else {
          additionalDescription = ` - ${reqs[name] - maxLevelCount} left`;
        }
      } else if (quests.has(name)) {
        // use general.questsCompleted and compare to reqs
        const questsCompleted = activePlayer.general?.questsCompleted ?? 0;

        if (questsCompleted >= reqs[name]) completed = true;
        else {
          additionalDescription = ` - ${reqs[name] - questsCompleted} left`;
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

    type SkillName = "farming" | "fishing" | "foraging" | "mining" | "combat";

    function calculateExperience(skillName: SkillName, activePlayer: any): any {
      const currentLevel = activePlayer.general.skills[skillName];

      if (currentLevel >= 10)
        return {
          percentage: 100,
          experiencePointsRemaining: 0,
          experiencePointsRequired: 0,
        };

      const currentExperience = activePlayer.general.experience[skillName];
      const nextLevelExperience = experienceRequired[currentLevel + 1];

      return {
        percentage: (currentExperience / nextLevelExperience) * 100,
        experiencePointsRemaining: nextLevelExperience - currentExperience,
        experiencePointsRequired: nextLevelExperience,
      };
    }

    if (activePlayer) {
      if (activePlayer.general?.experience && activePlayer.general?.skills) {
        return {
          farming: calculateExperience("farming", activePlayer),
          fishing: calculateExperience("fishing", activePlayer),
          foraging: calculateExperience("foraging", activePlayer),
          mining: calculateExperience("mining", activePlayer),
          combat: calculateExperience("combat", activePlayer),
        };
      }
    }
  }, [activePlayer]);

  const playerPowers = useMemo(() => {
    if (!activePlayer || !activePlayer.powers?.collection)
      return new Set<string>();

    const playerPowers = activePlayer.powers.collection;

    return new Set<string>(playerPowers);
  }, [activePlayer]);

  return (
    <>
      <Head>
        <title>stardew.app | Secret Notes</title>
        <meta
          name="title"
          content="Stardew Valley Skills & Mastery | stardew.app"
        />
        <meta
          name="description"
          content="Track and discover secret notes in Stardew Valley. Keep tabs on the secret notes you've found and uncover hidden secrets in Pelican Town. Monitor your progress towards collecting all the secret notes and unlock valuable rewards in the game."
        />
        <meta
          name="og:description"
          content="Track and discover secret notes in Stardew Valley. Keep tabs on the secret notes you've found and uncover hidden secrets in Pelican Town. Monitor your progress towards collecting all the secret notes and unlock valuable rewards in the game."
        />
        <meta
          name="twitter:description"
          content="Track and discover secret notes in Stardew Valley. Keep tabs on the secret notes you've found and uncover hidden secrets in Pelican Town. Monitor your progress towards collecting all the secret notes and unlock valuable rewards in the game."
        />
        <meta
          name="keywords"
          content="stardew valley secret notes tracker, stardew valley secret notes, stardew valley secret notes locations, stardew valley secret notes rewards, stardew valley secret notes collection, stardew valley gameplay tracker, stardew valley, stardew, secret notes tracker"
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
                  Skill Achievements
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
                    <div className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-3 xl:grid-cols-5">
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
                              iconURL={`https://cdn.stardew.app/images/beta/(POWER)${key}.webp`}
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
                              iconURL={`https://cdn.stardew.app/images/beta/(POWER)${key}.webp`}
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
                        iconURL={`https://cdn.stardew.app/images/beta/(POWER)${key}.webp`}
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
