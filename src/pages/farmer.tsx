import Head from "next/head";

import achievements from "@/data/achievements.json";

import { useEffect, useMemo, useState } from "react";

import { usePlayers } from "@/contexts/players-context";

import { AchievementCard } from "@/components/cards/achievement-card";
import { DialogCard } from "@/components/cards/dialog-card";
import { InfoCard } from "@/components/cards/info-card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import {
	BriefcaseIcon,
	ChartBarIcon,
	ClockIcon,
	CurrencyDollarIcon,
	HomeIcon,
	PencilSquareIcon,
	StarIcon,
	UserIcon,
} from "@heroicons/react/24/solid";

const STARDROPS = {
	CF_Fair: {
		title: "Fair Star",
		description:
			"Can be purchased at the Stardew Valley Fair for 2,000 star tokens.",
	},
	CF_Fish: {
		title: "Fishing Star",
		description:
			"Received in mail from Willy after completing the Master Angler Achievement.",
	},
	CF_Mines: {
		title: "Mines Star",
		description: "Obtained from the treasure chest on floor 100 in The Mines.",
	},
	CF_Sewer: {
		title: "Krobus Star",
		description: "Can be purchased from Krobus for 20,000g in The Sewers.",
	},
	CF_Spouse: {
		title: "Spouse Star",
		description:
			"Obtained from spouse after reaching a friendship level of 12.5 hearts.",
	},
	CF_Statue: {
		title: "Secret Woods Star",
		description:
			"Obtained from Old Master Cannoli in the Secret Woods after giving him a Sweet Gem Berry.",
	},
	museumComplete: {
		title: "Museum Star",
		description: "Reward for donating all 95 items to the Museum.",
	},
};

const stardrop_ach = {
	id: 34,
	gameID: null,
	name: "Mystery Of The Stardrops",
	description: "Find every stardrop.",
	iconURL:
		"https://stardewvalleywiki.com/mediawiki/images/e/e0/Achievement_Mystery_Of_The_Stardrops.jpg",
};

const reqs: Record<string, number> = {
	"Greenhorn": 15000,
	"Cowpoke": 50000,
	"Homesteader": 250000,
	"Millionaire": 1000000,
	"Legend": 10000000,
	"Gofer": 10,
	"A Big Help": 40,
};

export default function Farmer() {
	const { activePlayer, patchPlayer } = usePlayers();

	const [stardrops, setStardrops] = useState(new Set());
	const [editMoneyOpen, setEditMoneyOpen] = useState(false);
	const [editQuestsOpen, setEditQuestsOpen] = useState(false);
	const [editMoneyValue, setEditMoneyValue] = useState(0);
	const [editQuestsValue, setEditQuestsValue] = useState(0);

	useEffect(() => {
		if (activePlayer) {
			setStardrops(new Set(activePlayer?.general?.stardrops ?? []));
		}
	}, [activePlayer]);

	const playerLevel = useMemo(() => {
		// formula for player level is
		// (farmingLevel + fishingLevel + foragingLevel + miningLevel + combatLevel + luckLevel) / 2
		let playerLevel = 0;
		if (activePlayer) {
			// luck is unused as of 1.5
			if (activePlayer.general?.skills) {
				const { farming, fishing, foraging, mining, combat } =
					activePlayer.general.skills;

				playerLevel = Math.floor(
					(farming + fishing + foraging + mining + combat) / 2,
				);
			}
		}
		return playerLevel;
	}, [activePlayer]);

	const getAchievementProgress = (name: string) => {
		let completed = false;
		let additionalDescription = "";

		if (activePlayer) {
			const money = new Set([
				"Greenhorn",
				"Cowpoke",
				"Homesteader",
				"Millionaire",
				"Legend",
			]);
			const quests = new Set(["Gofer", "A Big Help"]);

			if (money.has(name)) {
				// use general.totalMoneyEarned and compare to reqs
				const moneyEarned = activePlayer.general?.totalMoneyEarned ?? 0;

				if (moneyEarned >= reqs[name]) completed = true;
				else {
					additionalDescription = ` - ${(
						reqs[name] - moneyEarned
					).toLocaleString()}g left`;
				}
			} else if (quests.has(name)) {
				// use general.questsCompleted and compare to reqs
				const questsCompleted = activePlayer.general?.questsCompleted ?? 0;

				if (questsCompleted >= reqs[name]) completed = true;
				else {
					additionalDescription = ` - ${reqs[name] - questsCompleted} left`;
				}
			}
		}

		return { completed, additionalDescription };
	};

	return (
		<>
			<Head>
				<title>Stardew Valley Farmer Tracker | stardew.app</title>
				<meta
					name="title"
					content="Stardew Valley Player Tracker | stardew.app"
				/>
				<meta
					name="description"
					content="Track and manage your achievements and Stardrops in Stardew Valley (supports 1.6 through 1.6.9). Keep tabs on the achievements you've unlocked and monitor your progress towards completing them all. Discover the locations and conditions for acquiring Stardrops and unlock their powerful effects. Maximize your skill level and become a master of the valley."
				/>
				<meta
					name="og:description"
					content="Track and manage your achievements and Stardrops in Stardew Valley. Keep tabs on the achievements you've unlocked and monitor your progress towards completing them all. Discover the locations and conditions for acquiring Stardrops and unlock their powerful effects. Maximize your skill level and become a master of the valley."
				/>
				<meta
					name="twitter:description"
					content="Track and manage your achievements and Stardrops in Stardew Valley. Keep tabs on the achievements you've unlocked and monitor your progress towards completing them all. Discover the locations and conditions for acquiring Stardrops and unlock their powerful effects. Maximize your skill level and become a master of the valley."
				/>
				<meta
					name="keywords"
					content="stardew valley achievement tracker, stardew valley achievements, stardew valley Stardrops, stardew valley Stardrop locations, stardew valley skill level, stardew valley mastery, stardew valley gameplay tracker, stardew valley, stardew, achievement tracker"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					{/* Farmer Information */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
									Farmer Information
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
										<InfoCard
											title="Farmer Name"
											description={
												activePlayer?.general?.name ?? "No Info Found"
											}
											Icon={UserIcon}
										/>
										<InfoCard
											title="Farmer Level"
											description={
												activePlayer ? playerLevel.toString() : "No Info Found"
											}
											Icon={ChartBarIcon}
										/>
										<InfoCard
											title="Farm Information"
											description={
												activePlayer?.general?.farmInfo ?? "No Info Found"
											}
											Icon={HomeIcon}
										/>
										<div className="relative">
											<InfoCard
												title="Farm Earnings"
												description={
													activePlayer?.general?.totalMoneyEarned
														? `${activePlayer.general.totalMoneyEarned.toLocaleString()}g`
														: "No Info Found"
												}
												Icon={CurrencyDollarIcon}
											/>
											{activePlayer && (
												<button
													className="absolute right-2 top-2 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
													onClick={() => {
														setEditMoneyValue(
															activePlayer.general?.totalMoneyEarned ?? 0,
														);
														setEditMoneyOpen(true);
													}}
													aria-label="Edit Farm Earnings"
												>
													<PencilSquareIcon className="h-4 w-4" />
												</button>
											)}
										</div>
										<InfoCard
											title="Playtime"
											description={
												activePlayer?.general?.timePlayed ?? "No Info Found"
											}
											Icon={ClockIcon}
										/>
										<div className="relative">
											<InfoCard
												title="Quests Completed"
												description={
													activePlayer?.general?.questsCompleted
														? activePlayer.general.questsCompleted.toString()
														: "No Info Found"
												}
												Icon={BriefcaseIcon}
											/>
											{activePlayer && (
												<button
													className="absolute right-2 top-2 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
													onClick={() => {
														setEditQuestsValue(
															activePlayer.general?.questsCompleted ?? 0,
														);
														setEditQuestsOpen(true);
													}}
													aria-label="Edit Quests Completed"
												>
													<PencilSquareIcon className="h-4 w-4" />
												</button>
											)}
										</div>
										<InfoCard
											title="Stardrops Found"
											description={
												activePlayer
													? stardrops.size.toString()
													: "No Info Found"
											}
											Icon={StarIcon}
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						</section>
					</Accordion>
					{/* Money Achievements */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
									Money Achievements
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
										{Object.values(achievements)
											.filter((achievement) => achievement.id <= 4)
											.map((achievement) => {
												const { completed, additionalDescription } =
													getAchievementProgress(achievement.name);

												return (
													<AchievementCard
														key={achievement.id}
														achievement={achievement}
														completed={completed}
														additionalDescription={additionalDescription}
													/>
												);
											})}
									</div>
								</AccordionContent>
							</AccordionItem>
						</section>
					</Accordion>
					{/* Quests Achievements */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
									Quests Achievements
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										{Object.values(achievements)
											.filter((a) => a.description.includes("requests"))
											.map((achievement) => {
												const { completed, additionalDescription } =
													getAchievementProgress(achievement.name);

												return (
													<AchievementCard
														key={achievement.id}
														achievement={achievement}
														completed={completed}
														additionalDescription={additionalDescription}
													/>
												);
											})}
									</div>
								</AccordionContent>
							</AccordionItem>
						</section>
					</Accordion>
					{/* Stardrops Achievements */}
					<section className="space-y-3">
						<h3 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
							Stardrops
						</h3>
						<div className="space-y-3">
							{/* hardcoding this one bc its only one */}
							<AchievementCard
								achievement={stardrop_ach}
								completed={stardrops.size >= Object.keys(STARDROPS).length}
								additionalDescription={
									activePlayer
										? stardrops.size >= Object.keys(STARDROPS).length
											? ""
											: ` - ${
													Object.keys(STARDROPS).length - stardrops.size
												} left`
										: ""
								}
							/>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
								{Object.entries(STARDROPS).map(([key, value]) => (
									<DialogCard
										key={key}
										description={value.description}
										title={value.title}
										iconURL="https://stardewvalleywiki.com/mediawiki/images/a/a5/Stardrop.png"
										completed={stardrops.has(key)}
										_id={key}
										_type="stardrop"
									/>
								))}
							</div>
						</div>
					</section>
				</div>
			</main>
			<Dialog open={editMoneyOpen} onOpenChange={setEditMoneyOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Farm Earnings</DialogTitle>
					</DialogHeader>
					<Input
						type="number"
						min={0}
						value={editMoneyValue}
						onChange={(e) => setEditMoneyValue(Number(e.target.value))}
						placeholder="Total gold earned"
					/>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditMoneyOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={async () => {
								await patchPlayer({
									general: { totalMoneyEarned: editMoneyValue },
								});
								setEditMoneyOpen(false);
							}}
						>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={editQuestsOpen} onOpenChange={setEditQuestsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Quests Completed</DialogTitle>
					</DialogHeader>
					<Input
						type="number"
						min={0}
						value={editQuestsValue}
						onChange={(e) => setEditQuestsValue(Number(e.target.value))}
						placeholder="Number of quests completed"
					/>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditQuestsOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={async () => {
								await patchPlayer({
									general: { questsCompleted: editQuestsValue },
								});
								setEditQuestsOpen(false);
							}}
						>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
