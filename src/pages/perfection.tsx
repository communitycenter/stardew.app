import Head from "next/head";

import { Construction } from "@/components/construction";

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
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 py-2 px-8 justify-center items-center`}
      >
        <Construction />
      </main>
    </>
  );
}
