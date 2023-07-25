import Head from "next/head";

import achievements from "@/research/processors/data/achievements.json";

import { useContext } from "react";
import { Inter } from "next/font/google";

import { PlayersContext } from "@/contexts/players-context";

import { InfoCard } from "@/components/cards/infocard";
import { AchievementCard } from "@/components/cards/achievementcard";

import {
  UserIcon,
  HomeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BriefcaseIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const inter = Inter({ subsets: ["latin"] });

// TODO: Missing platform specific achievements (skills and stardrops)
const reqs: Record<string, number> = {
  Greenhorn: 15000,
  Cowpoke: 50000,
  Homesteader: 250000,
  Millionaire: 1000000,
  Legend: 10000000,
  Gofer: 10,
  "A Big Help": 40,
};

export default function Farmer() {
  const { activePlayer } = useContext(PlayersContext);

  return (
    <>
      <Head>
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
        className={`flex min-h-screen items-left md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className} p-8`}
      >
        <div className="mx-auto max-w-7xl w-full">
          <div>
            <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Farmer Information
            </div>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <InfoCard
                title="Player Name"
                description={
                  activePlayer
                    ? activePlayer.general.name
                    : "No Player Selected"
                }
                Icon={UserIcon}
              />
              <InfoCard
                title="Farm Information"
                description={
                  activePlayer
                    ? activePlayer.general.farmInfo
                    : "No Player Selected"
                }
                Icon={HomeIcon}
              />
              <InfoCard
                title="Playtime"
                description={
                  activePlayer
                    ? activePlayer.general.timePlayed
                    : "No Player Selected"
                }
                Icon={ClockIcon}
              />
              <InfoCard
                title="Money Earned"
                description={
                  activePlayer
                    ? `${activePlayer.general.totalMoneyEarned.toLocaleString()}g`
                    : "No Player Selected"
                }
                Icon={CurrencyDollarIcon}
              />
              <InfoCard
                title="Farmer Level"
                description={
                  activePlayer
                    ? `${activePlayer.general.levels.Player}/25`
                    : "No Player Selected"
                }
                Icon={ChartBarIcon}
              />
              <InfoCard
                title="Quests Completed"
                description={
                  activePlayer
                    ? activePlayer.general.questsCompleted.toString()
                    : "No Player Selected"
                }
                Icon={BriefcaseIcon}
              />
              <InfoCard
                title="Stardrops Found"
                description={
                  activePlayer
                    ? activePlayer.general.stardropsCount.toString()
                    : "No Player Selected"
                }
                Icon={StarIcon}
              />
            </div>
          </div>
          {/* Money Achievements */}
          <div>
            <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Money
            </div>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {Object.values(achievements)
                .filter((achievement) => achievement.id <= 4)
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
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
          </div>
        </div>
      </main>
    </>
  );
}
