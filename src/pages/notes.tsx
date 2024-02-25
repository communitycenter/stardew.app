import Head from "next/head";

import notes from "@/data/secret_notes.json";

import { useEffect, useState } from "react";

import { DialogCard } from "@/components/cards/dialog-card";
import { usePlayers } from "@/contexts/players-context";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function SecretNotes() {
  const { activePlayer } = usePlayers();
  const [notesSeen, setNotesSeen] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (activePlayer && activePlayer.notes) {
      setNotesSeen(new Set(activePlayer.notes.found));
    }
  }, [activePlayer]);

  return (
    <>
      <Head>
        <title>stardew.app | Secret Notes</title>
        <meta
          name="title"
          content="Stardew Valley Secret Notes Locations | stardew.app"
        />
        <meta
          name="description"
          content="Track and discover secret notes in Stardew Valley. Keep tabs on the secret notes you've found and uncover hidden secrets in Pelican Town. Monitor your progress towards collecting all the secret notes and unlock valuable rewards in the game."
        />
        <meta
          name="og:description"
          content="Track and discover secret notes in Stardew Valley. Keep tabs on the secret notes you've found and uncover hidden secrets in Pelican Town. Monitor your progress towards collecting all the secret notes and unlock valuable rewards in the game."
        />
        <meta
          name="twitter:description"
          content="Track and discover secret notes in Stardew Valley. Keep tabs on the secret notes you've found and uncover hidden secrets in Pelican Town. Monitor your progress towards collecting all the secret notes and unlock valuable rewards in the game."
        />
        <meta
          name="keywords"
          content="stardew valley secret notes tracker, stardew valley secret notes, stardew valley secret notes locations, stardew valley secret notes rewards, stardew valley secret notes collection, stardew valley gameplay tracker, stardew valley, stardew, secret notes tracker"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className} py-2 px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Secret Notes Tracker{" "}
            {activePlayer ? `(${notesSeen.size}/25)` : "(0/25)"}
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(notes).map(([id, note]) => {
              return (
                <DialogCard
                  key={id}
                  title={note.name}
                  description={note.location}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/e/ec/Secret_Note.png"
                  completed={activePlayer ? notesSeen.has(parseInt(id)) : false}
                  _id={id}
                  _type="note"
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
