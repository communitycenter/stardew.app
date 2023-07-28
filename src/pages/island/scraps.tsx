import { Construction } from "@/components/construction";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function IslandScraps() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Track and discover Ginger Island journal scraps in Stardew Valley. Keep tabs on the journal scraps you've found and uncover the hidden stories and lore of Ginger Island. Monitor your progress towards completing the Ginger Island journal scrap collection and unravel the island's secrets."
        />
        <meta
          name="og:description"
          content="Track and discover Ginger Island journal scraps in Stardew Valley. Keep tabs on the journal scraps you've found and uncover the hidden stories and lore of Ginger Island. Monitor your progress towards completing the Ginger Island journal scrap collection and unravel the island's secrets."
        />
        <meta
          name="twitter:description"
          content="Track and discover Ginger Island journal scraps in Stardew Valley. Keep tabs on the journal scraps you've found and uncover the hidden stories and lore of Ginger Island. Monitor your progress towards completing the Ginger Island journal scrap collection and unravel the island's secrets."
        />
        <meta
          name="keywords"
          content="stardew valley Ginger Island journal scrap tracker, stardew valley Ginger Island journal scraps, stardew valley Ginger Island secrets, stardew valley journal scrap collection, stardew valley Ginger Island lore, stardew valley gameplay tracker, stardew valley, stardew, Ginger Island tracker"
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
