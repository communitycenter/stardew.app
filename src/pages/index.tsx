// every page is gonna need lg:border-l border-neutral-200 dark:border-neutral-800

import Head from "next/head";

import { useContext, useEffect } from "react";

import { PlayersContext } from "@/contexts/players-context";

export default function Home() {
  const { players, activePlayer } = useContext(PlayersContext);

  useEffect(() => {
    console.log("hello", players);
  }, [players]);

  return (
    <>
      <Head>
        <title>stardew.app | Stardew Valley 100% completion tracker</title>
        <meta
          name="description"
          content="The homepage for stardew.app. Upload your Stardew Valley Save File to track your progress towards 100% completion. Login to track your perfection progress across multiple devices."
        />
        <meta
          name="keywords"
          content="stardew valley tracker, stardew tracker, stardew valley perfection tracker, stardew perfection tracker, stardew completion tracker, stardew valley collection tracker, stardew progress checker, stardew valley checklist app, stardew valley tracker app, stardew valley app, stardew app, perfection tracker stardew, stardew checker, stardew valley checker, stardew valley completion tracker, tracker stardew valley, stardew valley save checker, stardew valley companion app, stardew valley progress tracker, stardew valley checklist app, stardew valley, stardew valley tracker app, stardew valley app"
        />
      </Head>
      <main
        className={`flex min-h-screen items-center justify-center md:border-l border-neutral-200 dark:border-neutral-800`}
      >
        <h1 className="text-4xl font-semibold">
          {players ? players.length : 0}
        </h1>
        <h1>
          Active Player: {activePlayer ? activePlayer.general.name : "none"}
        </h1>
      </main>
    </>
  );
}
