import { DialogCard } from "@/components/cards/dialog-card";
import { usePlayers } from "@/contexts/players-context";
import upgrades from "@/data/island_upgrades.json";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function IslandUpgrades() {
	const { activePlayer } = usePlayers();
	const [islandUpgrades, setIslandUpgrades] = useState<Set<String>>(new Set());

	useEffect(() => {
		if (
			activePlayer &&
			activePlayer.general &&
			activePlayer.general.islandUpgrades
		) {
			setIslandUpgrades(new Set(activePlayer.general.islandUpgrades));
		}
	}, [activePlayer]);

	let upgradeCards: JSX.Element[] = [];
	Object.entries(upgrades).forEach(([id, upgrade]) => {
		upgradeCards.push(
			<DialogCard
				key={id}
				title={upgrade.name}
				description={
					<div className="space-y-6 text-white">
						<section className="space-y-1">
							<h3 className="font-semibold text-white">Cost</h3>
							<span className="text-white flex items-center gap-1">
								<span
									className="align-middle"
									style={{ imageRendering: "pixelated" }}
								>
									{upgrade.cost}
								</span>
								<span
									className="w-5 h-5 align-middle relative flex items-center"
									style={{ imageRendering: "pixelated" }}
								>
									<Image
										src="https://stardewvalleywiki.com/mediawiki/images/5/54/Golden_Walnut.png"
										alt="Golden Walnut"
										fill
										className="object-contain"
										style={{ imageRendering: "pixelated" }}
										unoptimized
									/>
								</span>
							</span>
						</section>
						<section className="space-y-1">
							<h3 className="font-semibold text-white">Description</h3>
							<span className="block text-white">{upgrade.description}</span>
						</section>
						<section className="space-y-1">
							<h3 className="font-semibold text-white">Location</h3>
							<span className="block text-white">{upgrade.location}</span>
						</section>
					</div>
				}
				iconURL="https://stardewvalleywiki.com/mediawiki/images/5/54/Golden_Walnut.png"
				completed={activePlayer ? islandUpgrades.has(id) : false}
				_id={id}
				_type="island_upgrade"
			/>,
		);
	});

	return (
		<>
			<Head>
				<meta
					name="title"
					content="Stardew Valley Ginger Island Upgrades Tracker | stardew.app"
				/>
				<title>
					Stardew Valley Ginger Island Upgrades Tracker | stardew.app
				</title>
				<meta
					name="description"
					content="Track and discover Ginger Island Upgrades in Stardew Valley. Keep tabs on the upgrades you've discovered and monitor your progress towards completing them all. Discover the locations and secrets of each upgrade and unlock valuable rewards on the island."
				/>
				<meta
					name="og:description"
					content="Track and discover Ginger Island Upgrades in Stardew Valley."
				/>
				<meta
					name="twitter:description"
					content="Track and discover Ginger Island Upgrades in Stardew Valley,"
				/>
				<meta name="keywords" content="stardew valley Ginger Island" />
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 dark:border-neutral-800 md:border-l ${inter.className} px-8 py-2`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Island Upgrades Tracker{" "}
						{activePlayer
							? `(${islandUpgrades.size}/${upgradeCards.length})`
							: `(0/${upgradeCards.length})`}
					</h1>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{upgradeCards}
					</div>
				</div>
			</main>
		</>
	);
}
