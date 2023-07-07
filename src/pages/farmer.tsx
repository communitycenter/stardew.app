import { InfoCard } from "@/components/cards/infocard";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Farmer() {
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
        <div className="flex flex-col items-left justify-left">
          <div className="grid grid-cols-1 gap-4 py-4">
            <div>
              <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
                Farmer Information
              </div>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                <InfoCard title="Farmer" description="my name jeff" />
                <InfoCard title="Farmer" description="my name jeff" />
                <InfoCard title="Farmer" description="my name jeff" />
                <InfoCard title="Farmer" description="my name jeff" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
