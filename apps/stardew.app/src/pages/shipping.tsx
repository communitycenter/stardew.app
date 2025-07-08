import type { ShippingItem } from "@/types/items";

import Head from "next/head";

import achievements from "@/data/achievements.json";
import objects from "@/data/objects.json";
import shipping_items from "@/data/shipping.json";
export const typedShippingItems: Record<string, ShippingItem> = shipping_items;

import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";
import { useMemo, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { ShippingCard } from "@/components/cards/shipping-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { FilterSearch } from "@/components/filter-btn";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import { IconClock } from "@tabler/icons-react";

const semverGte = require("semver/functions/gte");

const reqs: Record<string, number> = {
	"Polyculture": Object.values(shipping_items).filter((i) => i.polyculture)
		.length,
	"Full Shipment": Object.keys(shipping_items).length - 2, // Clam and Smoked Fish is excluded in 1.6
};

const seasons = [
	{
		value: "all",
		label: "All Seasons",
	},
	{
		value: "Spring",
		label: "Spring",
	},
	{
		value: "Summer",
		label: "Summer",
	},
	{
		value: "Fall",
		label: "Fall",
	},
	{
		value: "Winter",
		label: "Winter",
	},
];

const bubbleColors: Record<string, string> = {
	"0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // unshipped
	"1": "border-green-900 bg-green-500/20", // shipped
	"2": "border-blue-900 bg-blue-500/20", // polyculture
};

export default function Shipping() {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const [_seasonFilter, setSeasonFilter] = useState("all");

	const [showPrompt, setPromptOpen] = useState(false);

	const { activePlayer } = usePlayers();
	const { show, toggleShow } = usePreferences();

	const gameVersion = useMemo(() => {
		if (!activePlayer || !activePlayer.general?.gameVersion) return "1.6.0";

		const version = activePlayer.general.gameVersion;
		// update the requirements for achievements and set the minimum game version
		reqs["Full Shipment"] = Object.values(shipping_items).filter((i) =>
			semverGte(version, i.minVersion),
		).length;

		if (semverGte(version, "1.6.0")) reqs["Full Shipment"]--; // Clam is excluded in 1.6

		reqs["Polyculture"] = Object.values(shipping_items).filter(
			(i) => i.polyculture && semverGte(version, i.minVersion),
		).length;

		return version;
	}, [activePlayer]);

	const basicShipped = useMemo(() => {
		if (!activePlayer || !activePlayer.shipping?.shipped) return {};
		return activePlayer.shipping.shipped;
	}, [activePlayer]);

	const [polycultureCount, monocultureAchieved, basicShippedCount] =
		useMemo(() => {
			if (!activePlayer || !activePlayer.shipping?.shipped)
				return [0, false, 0];

			let polycultureCount = 0;
			let monocultureAchieved = false;
			let basicShippedCount = 0;

			Object.keys(activePlayer.shipping.shipped).forEach((key) => {
				if (semverGte(gameVersion, "1.6.0") && key === "372") return; // Clam and Smoked Fish is excluded in 1.6

				// Polyculture calculation
				if (
					shipping_items[key as keyof typeof shipping_items] &&
					shipping_items[key as keyof typeof shipping_items].polyculture
				) {
					if ((activePlayer.shipping?.shipped[key] ?? 0) >= 15)
						polycultureCount++;
				}

				// Monoculture calculation
				if (
					shipping_items[key as keyof typeof shipping_items] &&
					shipping_items[key as keyof typeof shipping_items].monoculture
				) {
					if ((activePlayer.shipping?.shipped[key] ?? 0) >= 300)
						monocultureAchieved = true;
				}

				// Basic Shipped calculation
				basicShippedCount++;
			});
			return [polycultureCount, monocultureAchieved, basicShippedCount];
		}, [activePlayer, gameVersion]);

	const getAchievementProgress = (name: string) => {
		let completed = false;
		let additionalDescription = "";

		if (!activePlayer) {
			return { completed, additionalDescription };
		}

		if (name === "Monoculture") {
			completed = monocultureAchieved;
			return { completed, additionalDescription };
		} else if (name === "Polyculture") {
			completed = polycultureCount >= reqs[name];
			if (!completed) {
				additionalDescription = ` - ${reqs[name] - polycultureCount} left`;
			}
			return { completed, additionalDescription };
		}

		completed = basicShippedCount >= reqs[name];

		if (!completed) {
			additionalDescription = ` - ${reqs[name] - basicShippedCount} left`;
		}
		return { completed, additionalDescription };
	};

	// Calculate completedCount based on filtered items
	const completedCount = Object.values(typedShippingItems)
		.filter((i) => {
			// Clam is excluded in 1.6, so we won't show it
			if (i.itemID === "372") return !semverGte(gameVersion, "1.6.0");
			return true;
		})
		.filter((i) => semverGte(gameVersion, i.minVersion))
		.filter((i) => {
			if (_seasonFilter === "all") return true;
			return i.seasons.includes(_seasonFilter);
		})
		.filter((i) => i.itemID in basicShipped).length;

	return (
		<>
			<Head>
				<title>stardew.app | Shipping</title>
				<meta
					name="title"
					content="Stardew Valley Shipping Tracker | stardew.app"
				/>
				<meta
					name="description"
					content="Track your shipping progress and achievements in Stardew Valley. View the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
				/>
				<meta
					name="og:description"
					content="Track your shipping progress and achievements in Stardew Valley. View the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
				/>
				<meta
					name="twitter:description"
					content="Track your shipping progress and achievements in Stardew Valley. View the items you've shipped and monitor your progress towards completing the shipping achievements. Discover what items are left to ship and become a master shipper in Stardew Valley."
				/>
				<meta
					name="keywords"
					content="stardew valley shipping tracker, stardew valley shipping progress, stardew valley items shipped, stardew valley shipping achievements, stardew valley master shipper, stardew valley gameplay tracker, stardew valley, stardew, shipping tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Shipping Tracker
					</h1>
					{/* Achievements Section */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
									Achievements
								</AccordionTrigger>
								<AccordionContent asChild>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
										{Object.values(achievements)
											.filter((a) => a.description.includes("Ship"))
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
					{/* All Shipping Items Section */}
					<section className="space-y-3">
						<h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
							All Items
						</h2>
						{/* Filters and Actions Row */}
						<div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
							<div className="flex flex-row items-center gap-2">
								<ToggleGroup
									variant="outline"
									type="single"
									value={filter}
									onValueChange={(val) =>
										setFilter(val === filter ? "all" : val)
									}
									className="gap-2"
								>
									<ToggleGroupItem value="0" aria-label="Show Unshipped">
										<span
											className={cn(
												"inline-block h-4 w-4 rounded-full border align-middle",
												bubbleColors["0"],
											)}
										/>
										<span className="align-middle">
											Unshipped ({reqs["Full Shipment"] - basicShippedCount})
										</span>
									</ToggleGroupItem>
									<ToggleGroupItem value="1" aria-label="Show Polyculture">
										<span
											className={cn(
												"inline-block h-4 w-4 rounded-full border align-middle",
												bubbleColors["2"],
											)}
										/>
										<span className="align-middle">
											Polyculture ({reqs["Polyculture"] - polycultureCount})
										</span>
									</ToggleGroupItem>
									<ToggleGroupItem value="2" aria-label="Show Completed">
										<span
											className={cn(
												"inline-block h-4 w-4 rounded-full border align-middle",
												bubbleColors["1"],
											)}
										/>
										<span className="align-middle">
											Completed ({completedCount})
										</span>
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
							<div className="flex gap-2">
								<FilterSearch
									_filter={_seasonFilter}
									title={"Seasons"}
									data={seasons}
									setFilter={setSeasonFilter}
									icon={IconClock}
								/>
							</div>
						</div>
						{/* Search Bar Row */}
						<div className="mt-2 w-full">
							<Command className="w-full border border-b-0 dark:border-neutral-800">
								<CommandInput
									onValueChange={(v) => setSearch(v)}
									placeholder="Search Items"
								/>
							</Command>
						</div>
						{/* Items */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
							{Object.values(typedShippingItems)
								.filter((i) => {
									// Clam is excluded in 1.6, so we won't show it
									if (i.itemID === "372")
										return !semverGte(gameVersion, "1.6.0");
									return true;
								})
								.filter((i) => semverGte(gameVersion, i.minVersion))
								.filter((i) => {
									if (!search) return true;
									const name = objects[i.itemID as keyof typeof objects].name;
									return name.toLowerCase().includes(search.toLowerCase());
								})
								.filter((i) => {
									if (filter === "0") {
										// Unshipped
										return !(i.itemID in basicShipped);
									} else if (filter === "1") {
										// Polyculture in progress
										return (
											i.itemID in shipping_items &&
											shipping_items[i.itemID as keyof typeof shipping_items]
												.polyculture &&
											(!basicShipped[i.itemID] || basicShipped[i.itemID]! < 15)
										);
									} else if (filter === "2") {
										// Completed (all shipped)
										return i.itemID in basicShipped;
									} else return true; // all recipes
								})
								.filter((i) => {
									if (_seasonFilter === "all") return true;
									return i.seasons.includes(_seasonFilter);
								})
								.map((i) => (
									<ShippingCard
										key={i.itemID}
										item={i}
										show={show}
										setPromptOpen={setPromptOpen}
									/>
								))}
						</div>
					</section>
				</div>
			</main>
			<UnblurDialog
				open={showPrompt}
				setOpen={setPromptOpen}
				toggleShow={toggleShow}
			/>
		</>
	);
}
