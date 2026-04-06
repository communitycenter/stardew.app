import Head from "next/head";
import Image from "next/image";

import fish from "@/data/fish.json";
import objects from "@/data/objects.json";
import shippingItems from "@/data/shipping.json";
import villagers from "@/data/villagers.json";

import { usePlayers } from "@/contexts/players-context";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconFlameFilled } from "@tabler/icons-react";

const semverGte = require("semver/functions/gte");

const CC_ROOMS = [
	"Pantry",
	"Crafts Room",
	"Fish Tank",
	"Boiler Room",
	"Vault",
	"Bulletin Board",
];

const TOTAL_MUSEUM_ITEMS = Object.values(objects).filter(
	(o) => o.category === "Artifact" || o.category === "Mineral",
).length;

function bundleCompleted(bws: any): boolean {
	if (!bws?.bundleStatus) return false;
	const completed = (bws.bundleStatus as boolean[]).filter(Boolean).length;
	if (bws.bundle.itemsRequired === -1) return completed >= bws.bundle.items.length;
	return completed >= bws.bundle.itemsRequired;
}

function candlesForPoints(points: number): number {
	if (points >= 12) return 4;
	if (points >= 8) return 3;
	if (points >= 4) return 2;
	if (points >= 1) return 1;
	return 0;
}

interface Criterion {
	label: string;
	description: string;
	points: number;
	earned: boolean;
}

interface Section {
	title: string;
	maxPoints: number;
	criteria: Criterion[];
}

function CriterionRow({ criterion }: { criterion: Criterion }) {
	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg border px-4 py-3",
				criterion.earned
					? "border-green-900 bg-green-500/20 dark:bg-green-500/10"
					: "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
			)}
		>
			<div className="flex items-center gap-3">
				<span
					className={cn(
						"text-base",
						criterion.earned
							? "text-green-600 dark:text-green-400"
							: "text-neutral-300 dark:text-neutral-600",
					)}
				>
					{criterion.earned ? "✓" : "✗"}
				</span>
				<div>
					<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
						{criterion.label}
					</p>
					{criterion.description && (
						<p className="text-xs text-neutral-500 dark:text-neutral-400">
							{criterion.description}
						</p>
					)}
				</div>
			</div>
			<span
				className={cn(
					"shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
					criterion.earned
						? "bg-green-500/20 text-green-700 dark:text-green-400"
						: "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500",
				)}
			>
				+{criterion.points} pt{criterion.points !== 1 ? "s" : ""}
			</span>
		</div>
	);
}

function SectionCard({ section }: { section: Section }) {
	const earnedPoints = section.criteria.reduce(
		(sum, c) => sum + (c.earned ? c.points : 0),
		0,
	);
	const complete = earnedPoints === section.maxPoints;
	const incomplete = section.criteria.filter((c) => !c.earned);
	const earned = section.criteria.filter((c) => c.earned);
	const [showEarned, setShowEarned] = useState(false);

	return (
		<Card
			className={cn(
				complete && "border-green-900 bg-green-500/5 dark:border-green-900 dark:bg-green-500/5",
			)}
		>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base font-semibold">{section.title}</CardTitle>
					<span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
						{earnedPoints} / {section.maxPoints} pts
					</span>
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				{/* Incomplete criteria always visible */}
				{incomplete.map((c) => (
					<CriterionRow key={c.label} criterion={c} />
				))}

				{/* Earned criteria toggle */}
				{earned.length > 0 && (
					<>
						<button
							onClick={() => setShowEarned((v) => !v)}
							className="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
						>
							{showEarned ? "Hide" : "Show"} {earned.length} completed
						</button>
						{showEarned &&
							earned.map((c) => <CriterionRow key={c.label} criterion={c} />)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

export default function Grandpa() {
	const { activePlayer, players } = usePlayers();

	const farmName = useMemo(() => {
		if (!activePlayer?.general?.farmInfo) return null;
		return activePlayer.general.farmInfo.split(" (")[0];
	}, [activePlayer]);

	const gameVersion = useMemo(() => {
		if (!activePlayer?.general?.gameVersion) return "1.6.0";
		return activePlayer.general.gameVersion;
	}, [activePlayer]);

	const groupedFarmers = useMemo(() => {
		if (!players) return activePlayer ? [activePlayer] : [];
		return players.filter(
			(p: any) => p.general?.farmInfo === activePlayer?.general?.farmInfo,
		);
	}, [activePlayer, players]);

	const totalEarned = useMemo(
		() => Math.max(...groupedFarmers.map((p: any) => p.general?.totalMoneyEarned ?? 0), 0),
		[groupedFarmers],
	);

	const totalSkillLevels = useMemo(
		() =>
			Math.max(
				...groupedFarmers.map((p: any) => {
					const s = p.general?.skills ?? {};
					return (s.farming ?? 0) + (s.fishing ?? 0) + (s.foraging ?? 0) + (s.mining ?? 0) + (s.combat ?? 0);
				}),
				0,
			),
		[groupedFarmers],
	);

	const eightHeartCount = useMemo(
		() =>
			Math.max(
				...groupedFarmers.map((p: any) => {
					let count = 0;
					for (const name of Object.keys(p.social?.relationships ?? {})) {
						const v = villagers[name as keyof typeof villagers];
						if (!v) continue;
						const pts = p.social.relationships[name].points ?? 0;
						if (pts >= (v.datable ? 250 * 8 : 250 * 10)) count++;
					}
					return count;
				}),
				0,
			),
		[groupedFarmers],
	);

	const hasPetMaxFriendship = useMemo(
		() => groupedFarmers.some((p: any) => (p.animals?.pets ?? []).some((pet: any) => pet.friendship >= 1000)),
		[groupedFarmers],
	);

	const isMarriedWithFullHouse = useMemo(
		() => groupedFarmers.some((p: any) => p.social?.spouse && (p.social?.houseUpgradeLevel ?? 0) >= 2),
		[groupedFarmers],
	);

	const isCCComplete = useMemo(
		() =>
			groupedFarmers.some((p: any) => {
				const bundles: any[] = p.bundles ?? [];
				const ccBundles = bundles.filter((b) => CC_ROOMS.includes(b.bundle?.areaName));
				return ccBundles.length > 0 && ccBundles.every((b) => bundleCompleted(b));
			}),
		[groupedFarmers],
	);

	const deepestMine = useMemo(
		() => Math.max(...groupedFarmers.map((p: any) => p.monsters?.deepestMineLevel ?? 0), 0),
		[groupedFarmers],
	);

	const museumDonations = useMemo(
		() =>
			Math.max(
				...groupedFarmers.map((p: any) => (p.museum?.artifacts?.length ?? 0) + (p.museum?.minerals?.length ?? 0)),
				0,
			),
		[groupedFarmers],
	);

	const [fishCaughtCount, totalFish] = useMemo(() => {
		const total = Object.values(fish).filter((f) => semverGte(gameVersion, f.minVersion)).length;
		const count = Math.max(...groupedFarmers.map((p: any) => p.fishing?.fishCaught?.length ?? 0), 0);
		return [count, total];
	}, [groupedFarmers, gameVersion]);

	const [shippedCount, totalShipping] = useMemo(() => {
		const total =
			Object.values(shippingItems).filter((i) => semverGte(gameVersion, i.minVersion)).length -
			(semverGte(gameVersion, "1.6.0") ? 1 : 0);
		const count = Math.max(
			...groupedFarmers.map(
				(p: any) =>
					Object.keys(p.shipping?.shipped ?? {}).filter(
						(id) => !(id === "372" && semverGte(gameVersion, "1.6.0")),
					).length,
			),
			0,
		);
		return [count, total];
	}, [groupedFarmers, gameVersion]);

	const sections: Section[] = useMemo(
		() => [
			{
				title: "Earnings",
				maxPoints: 7,
				criteria: [
					{ label: "Earned 50,000g", description: `${totalEarned.toLocaleString()}g total earned`, points: 1, earned: totalEarned >= 50_000 },
					{ label: "Earned 100,000g", description: "", points: 1, earned: totalEarned >= 100_000 },
					{ label: "Earned 200,000g", description: "", points: 1, earned: totalEarned >= 200_000 },
					{ label: "Earned 300,000g", description: "", points: 1, earned: totalEarned >= 300_000 },
					{ label: "Earned 500,000g", description: "", points: 1, earned: totalEarned >= 500_000 },
					{ label: "Earned 1,000,000g", description: "", points: 2, earned: totalEarned >= 1_000_000 },
				],
			},
			{
				title: "Skills",
				maxPoints: 2,
				criteria: [
					{ label: "Total skill level ≥ 30", description: `${totalSkillLevels} / 50 total levels`, points: 1, earned: totalSkillLevels >= 30 },
					{ label: "Total skill level ≥ 50 (all maxed)", description: "", points: 1, earned: totalSkillLevels >= 50 },
				],
			},
			{
				title: "Relationships",
				maxPoints: 4,
				criteria: [
					{ label: "8-heart friends with 5+ villagers", description: `${eightHeartCount} at 8+ hearts`, points: 1, earned: eightHeartCount >= 5 },
					{ label: "8-heart friends with 10+ villagers", description: "", points: 1, earned: eightHeartCount >= 10 },
					{ label: "Pet at maximum friendship", description: "Water the pet bowl daily", points: 1, earned: hasPetMaxFriendship },
					{ label: "Married with fully upgraded house", description: "Requires marriage + 2 house upgrades", points: 1, earned: isMarriedWithFullHouse },
				],
			},
			{
				title: "Unlocks",
				maxPoints: 5,
				criteria: [
					{ label: "Complete the Community Center", description: "All 6 room bundles", points: 3, earned: isCCComplete },
					{ label: "Obtain the Skull Key (mine floor 120)", description: `Deepest: ${deepestMine} / 120`, points: 1, earned: deepestMine >= 120 },
					{ label: "Unlock the Sewer (60+ museum donations)", description: `${museumDonations} / 60 donated`, points: 1, earned: museumDonations >= 60 },
				],
			},
			{
				title: "Collections",
				maxPoints: 3,
				criteria: [
					{ label: "Complete the Museum", description: `${museumDonations} / ${TOTAL_MUSEUM_ITEMS} items`, points: 1, earned: museumDonations >= TOTAL_MUSEUM_ITEMS },
					{ label: "Catch every fish", description: `${fishCaughtCount} / ${totalFish} caught`, points: 1, earned: fishCaughtCount >= totalFish },
					{ label: "Ship one of every item", description: `${shippedCount} / ${totalShipping} shipped`, points: 1, earned: shippedCount >= totalShipping },
				],
			},
		],
		[totalEarned, totalSkillLevels, eightHeartCount, hasPetMaxFriendship, isMarriedWithFullHouse, isCCComplete, deepestMine, museumDonations, fishCaughtCount, totalFish, shippedCount, totalShipping],
	);

	const totalPoints = useMemo(
		() => sections.flatMap((s) => s.criteria).reduce((sum, c) => sum + (c.earned ? c.points : 0), 0),
		[sections],
	);

	const candles = candlesForPoints(totalPoints);
	const pointsToNext = candles < 4 ? ([4, 8, 12][candles] ?? 12) - totalPoints : 0;

	return (
		<>
			<Head>
				<title>{farmName ? `Grandpa's Evaluation for ${farmName} | stardew.app` : "Stardew Valley Grandpa's Evaluation | stardew.app"}</title>
				<meta name="title" content="Stardew Valley Grandpa's Evaluation | stardew.app" />
				<meta name="description" content="Track your score for Grandpa's Evaluation in Stardew Valley. See how many candles you'll earn and what criteria you still need to meet." />
				<meta name="keywords" content="stardew valley grandpa evaluation, grandpa score, grandpa candles, stardew valley year 3, stardew app" />
			</Head>
			<main className="flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8">
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						{farmName ? `Grandpa's Evaluation for ${farmName}` : "Grandpa's Evaluation"}
					</h1>

					{/* Score summary */}
					<Card>
						<CardContent className="flex items-center justify-between gap-4 p-5">
							<div className="flex items-center gap-4">
								<Image
									src={candles === 4
										? "https://stardewvalleywiki.com/mediawiki/images/5/51/Grandpa_Speaking.png"
										: "https://stardewvalleywiki.com/mediawiki/images/8/88/Grandpa.png"}
									alt="Grandpa"
									width={64}
									height={64}
									className="rounded"
									unoptimized
								/>
								<div>
									<p className="text-4xl font-bold text-neutral-900 dark:text-white">
										{totalPoints}
										<span className="ml-1 text-xl font-normal text-neutral-400 dark:text-neutral-500">
											/ 21 pts
										</span>
									</p>
									<p className="text-sm text-neutral-500 dark:text-neutral-400">
										{candles === 0
											? "Not enough points for a candle yet"
											: candles === 4
												? "4 candles lit — Grandpa is proud!"
												: `${candles} candle${candles !== 1 ? "s" : ""} lit · ${pointsToNext} more point${pointsToNext !== 1 ? "s" : ""} for ${candles + 1}`}
									</p>
								</div>
							</div>
							<div className="flex gap-1">
								{[1, 2, 3, 4].map((i) => (
									<IconFlameFilled
										key={i}
										size={32}
										style={{ color: i <= candles ? "#54C7FB" : undefined }}
										className={i <= candles ? "" : "text-neutral-200 dark:text-neutral-700"}
									/>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Sections */}
					<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
						{sections.map((section) => (
							<SectionCard key={section.title} section={section} />
						))}
					</div>
				</div>
			</main>
		</>
	);
}
