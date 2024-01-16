import { DialogCard } from "@/components/cards/dialog-card";
import { PlayersContext } from "@/contexts/players-context";
import scraps from "@/data/journal_scraps.json";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function IslandScraps() {
  const { activePlayer } = useContext(PlayersContext);
  const [scrapsFound, setScrapsFound] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (activePlayer && activePlayer.scraps) {
      setScrapsFound(new Set(activePlayer.scraps.found));
    }
  }, [activePlayer]);

  return (
    <>
      <Head>
        <meta name="title" content="stardew.app | Journal Scraps Tracker" />
        <title>stardew.app | Journal Scraps</title>
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
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className} py-2 px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Journal Scraps Tracker{" "}
            {activePlayer ? `(${scrapsFound.size}/11)` : "(0/11)"}
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(scraps).map(([id, note]) => {
              return (
                <DialogCard
                  key={id}
                  title={note.name}
                  description={note.info}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/c/c4/Journal_Scrap.png"
                  completed={
                    activePlayer ? scrapsFound.has(parseInt(id)) : false
                  }
                  _id={id}
                  _type="scrap"
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
