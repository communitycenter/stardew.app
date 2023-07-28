import { Construction } from "@/components/construction";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function IslandWalnuts() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="og:description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="twitter:description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="keywords"
          content="stardew valley Golden Walnut tracker, stardew valley Golden Walnuts, stardew valley Golden Walnut locations, stardew valley Golden Walnut rewards, stardew valley Golden Walnut collection, stardew valley gameplay tracker, stardew valley, stardew, Golden Walnut tracker"
        />
      </Head>
      <main
        className={`flex min-h-screen items-center justify-center md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className}`}
      >
        <Construction />
      </main>
    </>
  );
}
