import Head from "next/head";

import { Construction } from "@/components/construction";

export default function Museum() {
  return (
    <>
      <Head>
        <title>stardew.app | Museum</title>
        <meta
          name="description"
          content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley museum tracker, stardew valley artifacts, stardew valley minerals, stardew valley fossils, stardew valley museum collection, stardew valley curator, stardew valley 100% completion, stardew valley completionist, stardew valley hidden treasures, stardew valley mysteries, stardew valley past, stardew valley perfection tracker, stardew valley, stardew, stardew museum, stardew valley collectibles, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen items-center justify-center md:border-l border-neutral-200 dark:border-neutral-800`}
      >
        <Construction />
      </main>
    </>
  );
}
