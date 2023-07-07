import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Shipping() {
  return (
    <>
      <Head>
        <title>stardew.app | Shipping</title>
        <meta
          name="description"
          content="Track your shipping progress and achievements in Stardew Valley. Keep tabs on the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your shipping progress and achievements in Stardew Valley. Keep tabs on the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your shipping progress and achievements in Stardew Valley. Keep tabs on the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley shipping tracker, stardew valley shipping progress, stardew valley items shipped, stardew valley shipping achievements, stardew valley master shipper, stardew valley gameplay tracker, stardew valley, stardew, shipping tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <main
        className={`flex min-h-screen items-center justify-center md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className}`}
      >
        <h1 className="text-4xl font-semibold">placeholder</h1>
      </main>
    </>
  );
}
