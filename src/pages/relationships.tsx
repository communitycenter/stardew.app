import Head from "next/head";

import achievements from "@/data/achievements.json";
import villagers from "@/data/villagers.json";

import type { Villager } from "@/types/items";

import { usePlayers } from "@/contexts/players-context";
import { useMemo, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { InfoCard } from "@/components/cards/info-card";
import { VillagerCard } from "@/components/cards/villager-card";
import { FilterSearch } from "@/components/filter-btn";
import { VillagerSheet } from "@/components/sheets/villager-sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import { HeartIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/solid";
import { IconAdjustments, IconBabyCarriage } from "@tabler/icons-react";

const reqs: Record<string, number> = {
	"A New Friend": 1,
	"Cliques": 4,
	"Networking": 10,
	"Popular": 20,
	"Best Friends": 1,
	"The Beloved Farmer": 8,
	"Moving Up": 1,
	"Living Large": 2,
};

const sort_filters = [
	{ value: "name", label: "Name" },
	{ value: "hearts", label: "Hearts" },
];

const bubbleColors: Record<string, string> = {
	"0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // incomplete
	"2": "border-green-900 bg-green-500/20", // completed
};

export default function Relationships() {
	const { activePlayer } = usePlayers();

	const [open, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [_filter, setFilter] = useState("all");
	const [villager, setVillager] = useState<Villager>(villagers["Abigail"]);

	const [sort, setSort] = useState("name");

	const fiveHeartCount = useMemo(() => {
		if (!activePlayer || !activePlayer.social) return 0;

		let fiveHeartCount = 0;
		for (const relationship of Object.values(
			activePlayer.social.relationships,
		)) {
			if (relationship.points >= 250 * 5) fiveHeartCount++;
		}
		return fiveHeartCount;
	}, [activePlayer]);

	const tenHeartCount = useMemo(() => {
		if (!activePlayer || !activePlayer.social) return 0;

		let tenHeartCount = 0;
		for (const relationship of Object.values(
			activePlayer.social.relationships,
		)) {
			if (relationship.points >= 250 * 10) tenHeartCount++;
		}
		return tenHeartCount;
	}, [activePlayer]);

	const getAchievementProgress = (name: string) => {
		const five = new Set(["A New Friend", "Cliques", "Networking", "Popular"]);
		const ten = new Set(["Best Friends", "The Beloved Farmer"]);
		const house = new Set(["Moving Up", "Living Large"]);
		let completed = false;
		let additionalDescription = "";

		if (!activePlayer || !activePlayer.social) {
			return { completed, additionalDescription };
		}

		if (five.has(name)) {
			// use 5 heart count relationships
			completed = fiveHeartCount >= reqs[name];
			if (!completed) {
				additionalDescription = ` - ${reqs[name] - fiveHeartCount} left`;
			}
		} else if (ten.has(name)) {
			// use 10 heart count relationships
			completed = tenHeartCount >= reqs[name];
			if (!completed) {
				additionalDescription = ` - ${reqs[name] - tenHeartCount} left`;
			}
		} else if (house.has(name)) {
			// house upgrades
			completed = (activePlayer.social.houseUpgradeLevel ?? 0) >= reqs[name];
			if (!completed) {
				additionalDescription = ` - ${reqs[name] - (activePlayer.social.houseUpgradeLevel ?? 0)} left`;
			}
		} else {
			// get married and have two kids
			if (
				activePlayer.social.spouse &&
				activePlayer.social.spouse !== "" &&
				(activePlayer.social.childrenCount ?? 0) >= 2
			) {
				completed = true;
			}
			if (!completed) {
				additionalDescription = ` - ${2 - (activePlayer.social.childrenCount ?? 0)} left`;
			}
		}
		return { completed, additionalDescription };
	};

	const isVillagerCompleted = (villager: Villager) => {
		if (!activePlayer || !activePlayer.social) return false;

		const points =
			activePlayer.social.relationships?.[villager.name]?.points ?? 0;

		if (villager.datable) return points >= 250 * 8;
		else return points >= 250 * 10;
	};

	return (
		<>
			<Head>
				<title>Stardew Valley Relationships Tracker | stardew.app</title>
				<meta
					name="title"
					content="Stardew Valley Villagers Tracker | stardew.app"
				/>
				<meta
					name="description"
					content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
				/>
				<meta
					name="og:description"
					content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
				/>
				<meta
					name="twitter:description"
					content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
				/>
				<meta
					name="keywords"
					content="stardew valley relationship tracker, stardew valley villager relationships, stardew valley heart levels, stardew valley gifts, stardew valley community, stardew valley friendship, stardew valley gameplay tracker, stardew valley, stardew, relationship tracker"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Social & Family Tracker
					</h1>
					{/* Info related to achievements */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
									Social & Family Information
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
										<InfoCard
											title="Five Heart Relationships"
											description={fiveHeartCount.toString() ?? "No Info"}
											Icon={HeartIcon}
										/>
										<InfoCard
											title="Ten Heart Relationships"
											description={tenHeartCount.toString() ?? "No Info"}
											Icon={HeartIcon}
										/>
										<InfoCard
											title="Children"
											description={
												(activePlayer?.social?.childrenCount ?? 0).toString() ??
												"No Info"
											}
											Icon={IconBabyCarriage}
										/>
										<InfoCard
											title="House Upgrade Level"
											description={
												(
													activePlayer?.social?.houseUpgradeLevel ?? 0
												).toString() ?? "No Info"
											}
											Icon={HomeIcon}
										/>
										<InfoCard
											title={
												activePlayer?.social?.spouse === "Krobus"
													? "Roommate"
													: "Spouse"
											}
											description={activePlayer?.social?.spouse ?? "No Info"}
											Icon={UsersIcon}
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						</section>
					</Accordion>
					{/* Achievements Section */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
									Achievements
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-3">
										<h3 className="ml-1 text-base font-semibold text-gray-900 dark:text-white">
											Relationships
										</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
											{Object.values(achievements)
												.filter((a) => a.description.includes("heart"))
												.map((a) => {
													const { completed, additionalDescription } =
														getAchievementProgress(a.name);
													return (
														<AchievementCard
															key={a.name}
															achievement={a}
															completed={completed}
															additionalDescription={additionalDescription}
														/>
													);
												})}
										</div>
										<h3 className="ml-1 text-base font-semibold text-gray-900 dark:text-white">
											Home & Family
										</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
											{Object.values(achievements)
												.filter(
													(a) =>
														a.description.includes("house") ||
														a.description.includes("married"),
												)
												.map((a) => {
													const { completed, additionalDescription } =
														getAchievementProgress(a.name);
													return (
														<AchievementCard
															key={a.name}
															achievement={a}
															completed={completed}
															additionalDescription={additionalDescription}
														/>
													);
												})}
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</section>
					</Accordion>
					{/* Villagers Section */}
					<section className="space-y-3">
						<h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
							All Villagers
						</h2>
						<div className="grid grid-cols-1 justify-between gap-2 lg:flex">
							<div className="flex flex-row items-center gap-2">
								<ToggleGroup
									variant="outline"
									type="single"
									value={_filter}
									onValueChange={(val) =>
										setFilter(val === _filter ? "all" : val)
									}
									className="gap-2"
								>
									<ToggleGroupItem value="0" aria-label="Show Incomplete">
										<span
											className={cn(
												"inline-block h-4 w-4 rounded-full border align-middle",
												bubbleColors["0"],
											)}
										/>
										<span className="align-middle">Incomplete</span>
									</ToggleGroupItem>
									<ToggleGroupItem value="2" aria-label="Show Completed">
										<span
											className={cn(
												"inline-block h-4 w-4 rounded-full border align-middle",
												bubbleColors["2"],
											)}
										/>
										<span className="align-middle">Completed</span>
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
							<div className="grid grid-cols-1 items-stretch gap-2 sm:flex">
								<FilterSearch
									_filter={sort}
									title="Sort By"
									data={sort_filters}
									setFilter={setSort}
									icon={IconAdjustments}
								/>
							</div>
						</div>
						{/* Search Bar Row */}
						<div className="mt-2 w-full">
							<Command className="w-full border border-b-0 dark:border-neutral-800">
								<CommandInput
									onValueChange={(v) => setSearch(v)}
									placeholder="Search Villagers"
								/>
							</Command>
						</div>
						<div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
							{Object.values(villagers)
								.filter((v) => {
									if (!search) return true;
									else {
										return v.name.toLowerCase().includes(search.toLowerCase());
									}
								})
								.filter((v) => {
									switch (_filter) {
										case "all":
											return true;
										case "0":
											return !isVillagerCompleted(v);
										case "2":
											return isVillagerCompleted(v);
									}
								})
								.sort((a, b) => {
									if (sort === "hearts") {
										return (
											(activePlayer?.social?.relationships?.[b.name]?.points ??
												0) -
											(activePlayer?.social?.relationships?.[a.name]?.points ??
												0)
										);
									} else {
										return a.name.localeCompare(b.name);
									}
								})
								.map((v) => (
									<VillagerCard
										key={v.name}
										villager={v}
										points={
											activePlayer?.social?.relationships?.[v.name]?.points ?? 0
										}
										status={
											activePlayer?.social?.relationships?.[v.name]?.status ??
											null
										}
										setIsOpen={setIsOpen}
										setVillager={setVillager}
									/>
								))}
						</div>
					</section>
				</div>
				<VillagerSheet open={open} setIsOpen={setIsOpen} villager={villager} />
			</main>
		</>
	);
}
