import Head from "next/head";

import { PerfectionCard } from "@/components/cards/perfection-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PercentageIndicator } from "@/components/percentage";

export default function Perfection() {
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
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Perfection Tracker
          </h1>
          <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-4 grid-rows-4">
            <Card className="col-span-1 row-span-full w-full flex justify-center items-center">
              <div className="flex flex-col items-center p-4">
                <CardHeader className="flex flex-row items-cnter justify-between space-y-0 mb-2 p-0">
                  <CardTitle className="text-2xl font-semibold">
                    Total Perfection
                  </CardTitle>
                </CardHeader>

                <PercentageIndicator
                  percentage={59}
                  className="h-32 w-32 lg:h-48 lg:w-48"
                />
              </div>
            </Card>

            <PerfectionCard
              title="Produce & Forage Shipped"
              description="124/145"
              percentage={85}
              footer="15% of total perfection"
            />
            <PerfectionCard
              title="Obelisks on Farm"
              description="2/4"
              percentage={50}
              footer="4% of total perfection"
            />
            <PerfectionCard
              title="Golden Clock on Farm"
              description="Missing"
              percentage={0}
              footer="10% of total perfection"
            />
            <PerfectionCard
              title="Monster Slayer Hero"
              description="12/12"
              percentage={100}
              footer="10% of total perfection"
            />
            <PerfectionCard
              title="Great Friends"
              description="33/34"
              percentage={97}
              footer="11% of total perfection"
            />
            <PerfectionCard
              title="Farmer Level"
              description="25/25"
              percentage={100}
              footer="5% of total perfection"
            />
            <PerfectionCard
              title="Stardrops"
              description="5/7"
              percentage={71}
              footer="10% of total perfection"
            />
            <PerfectionCard
              title="Cooking Recipes Made"
              description="6/80"
              percentage={7}
              footer="10% of total perfection"
            />
            <PerfectionCard
              title="Crafting Recipes Made"
              description="52/129"
              percentage={40}
              footer="10% of total perfection"
            />
            <PerfectionCard
              title="Fish Caught"
              description="60/67"
              percentage={89}
              footer="10% of total perfection"
            />
            <PerfectionCard
              title="Golden Walnuts"
              description="128/130"
              percentage={98}
              footer="5% of total perfection"
            />
          </div>
        </div>
        {/* <PercentageIndicator percentage={20} /> */}
      </main>
    </>
  );
}
