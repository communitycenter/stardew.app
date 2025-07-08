import { DialogCard } from "@/components/cards/dialog-card";
import { usePlayers } from "@/contexts/players-context";
import notes from "@/data/secret_notes.json";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function IslandScraps() {
	const { activePlayer } = usePlayers();
	const [scrapsFound, setScrapsFound] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (activePlayer && activePlayer.scraps) {
			setScrapsFound(new Set(activePlayer.scraps.found));
		}
	}, [activePlayer]);

	let journalScraps: JSX.Element[] = [];
	Object.entries(notes).forEach(([id, note]) => {
		if (parseInt(id) < 1000) {
			return;
		}
		let content;
		let results = note.content.match(/\[(.+)\]\((.+)\)/);
		if (results) {
			content = (
				<Image src={results[2]} alt={results[1]} width={216} height={216} />
			);
		} else {
			content = note.content;
		}
		journalScraps.push(
			<DialogCard
				key={id}
				title={note.name}
				description={content}
				iconURL="https://stardewvalleywiki.com/mediawiki/images/c/c4/Journal_Scrap.png"
				completed={activePlayer ? scrapsFound.has(parseInt(id)) : false}
				_id={id}
				_type="scrap"
			/>,
		);
	});

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
				className={`flex min-h-screen border-neutral-200 dark:border-neutral-800 md:border-l ${inter.className} px-8 py-2`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Journal Scraps Tracker{" "}
						{activePlayer
							? `(${scrapsFound.size}/${journalScraps.length})`
							: `(0/${journalScraps.length})`}
					</h1>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{journalScraps}
					</div>
				</div>
			</main>
		</>
	);
}
