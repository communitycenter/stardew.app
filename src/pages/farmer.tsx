import Head from "next/head";

import achievements from "@/data/achievements.json";

import { useContext } from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InfoCard } from "@/components/cards/info-card";
import { DialogCard } from "@/components/cards/dialog-card";
import { AchievementCard } from "@/components/cards/achievement-card";

import {
  UserIcon,
  HomeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BriefcaseIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const STARDROPS = {
  CF_Fair: {
    title: "Fair Star",
    description:
      "Can be purchased at the Stardew Valley Fair for 2,000 star tokens.",
  },
  CF_Fish: {
    title: "Fishing Star",
    description:
      "Received in mail from Willy after completing the Master Angler Achievement.",
  },
  CF_Mines: {
    title: "Mines Star",
    description: "Obtained from the treasure chest on floor 100 in The Mines.",
  },
  CF_Sewer: {
    title: "Krobus Star",
    description: "Can be purchased from Krobus for 20,000g in The Sewers.",
  },
  CF_Spouse: {
    title: "Spouse Star",
    description:
      "Obtained from spouse after reaching a friendship level of 12.5 hearts.",
  },
  CF_Statue: {
    title: "Secret Woods Star",
    description:
      "Obtained from Old Master Cannoli in the Secret Woods after giving him a Sweet Gem Berry.",
  },
  museumComplete: {
    title: "Museum Star",
    description: "Reward for donating all 95 items to the Museum.",
  },
};

const stardrop_ach = {
  id: 34,
  name: "Mystery Of The Stardrops",
  description: "Find every stardrop.",
  iconURL:
    "https://stardewvalleywiki.com/mediawiki/images/e/e0/Achievement_Mystery_Of_The_Stardrops.jpg",
};

const reqs: Record<string, number> = {
  Greenhorn: 15000,
  Cowpoke: 50000,
  Homesteader: 250000,
  Millionaire: 1000000,
  Legend: 10000000,
  Gofer: 10,
  "A Big Help": 40,
  "Singular Talent": 1, // platform specific
  "Master Of The Five Ways": 5, // platform specific
};

export default function Farmer() {
  const { activePlayer } = useContext(PlayersContext);

  return (
    <>
      <Head>
        <title>stardew.app | Farmer Tracker</title>
        <meta
          name="description"
          content="Track and manage your achievements and Stardrops in Stardew Valley. Keep tabs on the achievements you've unlocked and monitor your progress towards completing them all. Discover the locations and conditions for acquiring Stardrops and unlock their powerful effects. Maximize your skill level and become a master of the valley."
        />
        <meta
          name="og:description"
          content="Track and manage your achievements and Stardrops in Stardew Valley. Keep tabs on the achievements you've unlocked and monitor your progress towards completing them all. Discover the locations and conditions for acquiring Stardrops and unlock their powerful effects. Maximize your skill level and become a master of the valley."
        />
        <meta
          name="twitter:description"
          content="Track and manage your achievements and Stardrops in Stardew Valley. Keep tabs on the achievements you've unlocked and monitor your progress towards completing them all. Discover the locations and conditions for acquiring Stardrops and unlock their powerful effects. Maximize your skill level and become a master of the valley."
        />
        <meta
          name="keywords"
          content="stardew valley achievement tracker, stardew valley achievements, stardew valley Stardrops, stardew valley Stardrop locations, stardew valley skill level, stardew valley mastery, stardew valley gameplay tracker, stardew valley, stardew, achievement tracker"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          {/* Farmer Information */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white pt-0">
                  Farmer Information
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    <InfoCard
                      title="Player Name"
                      description={
                        activePlayer
                          ? activePlayer.general.name
                          : "No Info Found"
                      }
                      Icon={UserIcon}
                    />
                    <InfoCard
                      title="Farm Information"
                      description={
                        activePlayer
                          ? activePlayer.general.farmInfo
                          : "No Info Found"
                      }
                      Icon={HomeIcon}
                    />
                    <InfoCard
                      title="Playtime"
                      description={
                        activePlayer
                          ? activePlayer.general.timePlayed
                          : "No Info Found"
                      }
                      Icon={ClockIcon}
                    />
                    <InfoCard
                      title="Money Earned"
                      description={
                        activePlayer
                          ? `${activePlayer.general.totalMoneyEarned.toLocaleString()}g`
                          : "No Info Found"
                      }
                      Icon={CurrencyDollarIcon}
                    />
                    <InfoCard
                      title="Farmer Level"
                      description={
                        activePlayer
                          ? `${activePlayer.general.levels.Player}/25`
                          : "No Info Found"
                      }
                      Icon={ChartBarIcon}
                    />
                    <InfoCard
                      title="Quests Completed"
                      description={
                        activePlayer
                          ? activePlayer.general.questsCompleted.toString()
                          : "No Info Found"
                      }
                      Icon={BriefcaseIcon}
                    />
                    <InfoCard
                      title="Stardrops Found"
                      description={
                        activePlayer
                          ? activePlayer.general.stardropsCount.toString()
                          : "No Info Found"
                      }
                      Icon={StarIcon}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Money Achievements */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white pt-0">
                  Money Achievements
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Object.values(achievements)
                      .filter((achievement) => achievement.id <= 4)
                      .map((achievement) => (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                          completed={
                            activePlayer
                              ? activePlayer.general.totalMoneyEarned >=
                                reqs[achievement.name]
                              : false
                          }
                          additionalDescription={
                            activePlayer
                              ? activePlayer.general.totalMoneyEarned >=
                                reqs[achievement.name]
                                ? ""
                                : ` - ${(
                                    reqs[achievement.name] -
                                    activePlayer.general.totalMoneyEarned
                                  ).toLocaleString()}g left`
                              : ""
                          }
                        />
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Skill Achievements */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white pt-0">
                  Skill Achievements
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {Object.values(achievements)
                        .filter((achievement) =>
                          achievement.description.includes("skill")
                        )
                        .map((achievement) => (
                          <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                            completed={
                              activePlayer
                                ? activePlayer.general.maxLevelCount >=
                                  reqs[achievement.name]
                                : false
                            }
                            additionalDescription={
                              activePlayer
                                ? activePlayer.general.maxLevelCount >=
                                  reqs[achievement.name]
                                  ? ""
                                  : ` - ${(
                                      reqs[achievement.name] -
                                      activePlayer.general.maxLevelCount
                                    ).toLocaleString()} left`
                                : ""
                            }
                          />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-3 xl:grid-cols-5">
                      <InfoCard
                        title="Farming"
                        description={
                          activePlayer
                            ? `Level ${activePlayer.general.levels.Farming}`
                            : "Level 0"
                        }
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/8/82/Farming_Skill_Icon.png"
                      />
                      <InfoCard
                        title="Fishing"
                        description={
                          activePlayer
                            ? `Level ${activePlayer.general.levels.Fishing}`
                            : "Level 0"
                        }
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/e/e7/Fishing_Skill_Icon.png"
                      />
                      <InfoCard
                        title="Foraging"
                        description={
                          activePlayer
                            ? `Level ${activePlayer.general.levels.Foraging}`
                            : "Level 0"
                        }
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/f/f1/Foraging_Skill_Icon.png"
                      />
                      <InfoCard
                        title="Mining"
                        description={
                          activePlayer
                            ? `Level ${activePlayer.general.levels.Mining}`
                            : "Level 0"
                        }
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/2/2f/Mining_Skill_Icon.png"
                      />
                      <InfoCard
                        title="Combat"
                        description={
                          activePlayer
                            ? `Level ${activePlayer.general.levels.Combat}`
                            : "Level 0"
                        }
                        sourceURL="https://stardewvalleywiki.com/mediawiki/images/c/cf/Combat_Skill_Icon.png"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Quests Achievements */}
          <Accordion type="single" collapsible defaultValue="item-1" asChild>
            <section className="space-y-3">
              <AccordionItem value="item-1">
                <AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white pt-0">
                  Quests Achievements
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.values(achievements)
                      .filter((a) => a.description.includes("requests"))
                      .map((achievement) => (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                          completed={
                            activePlayer
                              ? activePlayer.general.questsCompleted >=
                                reqs[achievement.name]
                              : false
                          }
                          additionalDescription={
                            activePlayer
                              ? activePlayer.general.questsCompleted >=
                                reqs[achievement.name]
                                ? ""
                                : ` - ${
                                    reqs[achievement.name] -
                                    activePlayer.general.questsCompleted
                                  } left`
                              : ""
                          }
                        />
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </section>
          </Accordion>
          {/* Stardrops Achievements */}
          <section className="space-y-3">
            <h3 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
              Stardrops
            </h3>
            <div className="space-y-3">
              {/* hardcoding this one bc its only one */}
              <AchievementCard
                achievement={stardrop_ach}
                completed={
                  activePlayer
                    ? activePlayer.general.stardropsCount >=
                      Object.keys(STARDROPS).length
                    : false
                }
                additionalDescription={
                  activePlayer
                    ? activePlayer.general.stardropsCount >=
                      Object.keys(STARDROPS).length
                      ? ""
                      : ` - ${
                          Object.keys(STARDROPS).length -
                          activePlayer.general.stardropsCount
                        } left`
                    : ""
                }
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Object.entries(STARDROPS).map(([key, value]) => (
                  <DialogCard
                    key={key}
                    description={value.description}
                    title={value.title}
                    iconURL="https://stardewvalleywiki.com/mediawiki/images/a/a5/Stardrop.png"
                    completed={
                      activePlayer ? activePlayer.general.stardrops[key] : false
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
