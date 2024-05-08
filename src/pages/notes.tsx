import Head from "next/head";
import Image from "next/image";

import notes from "@/data/secret_notes.json";

import { useEffect, useState } from "react";
import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";

import { DialogCard } from "@/components/cards/dialog-card";

export default function SecretNotes() {
  const { activePlayer } = usePlayers();
  const { show } = usePreferences();

  const [notesSeen, setNotesSeen] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (activePlayer) {
      setNotesSeen(new Set(activePlayer.notes?.found ?? []));
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
        className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="mx-auto mt-4 w-full space-y-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Secret Notes Tracker{" "}
            {activePlayer
              ? `(${notesSeen.size}/${Object.values(notes).length})`
              : `(0/${Object.values(notes).length})`}
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(notes).map(([id, note]) => {
              let content;
              let results = note.content.match(/\[(.+)\]\((.+)\)/);
              if (results) {
                content = (
                  <Image
                    src={results[2]}
                    alt={results[1]}
                    width={64}
                    height={64}
                  />
                );
              } else {
                content = note.content;
              }
              return (
                <DialogCard
                  key={id}
                  title={note.name}
                  description={content}
                  iconURL="https://stardewvalleywiki.com/mediawiki/images/e/ec/Secret_Note.png"
                  completed={activePlayer ? notesSeen.has(parseInt(id)) : false}
                  _id={id}
                  _type="note"
                  show={show}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
