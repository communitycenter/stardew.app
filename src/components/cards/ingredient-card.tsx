import Image from "next/image";

import bigCraftables from "@/data/big_craftables.json";
import fishes from "@/data/fish.json";
import ingredientSources from "@/data/ingredient_sources.json";
import objects from "@/data/objects.json";

import type { FishType } from "@/types/items";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { deweaponize } from "@/lib/utils";

import { FishSheet } from "@/components/sheets/fish-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	IconBuildingStore,
	IconChefHat,
	IconChevronRight,
	IconExternalLink,
	IconFish,
	IconHammer,
	IconLeaf,
	IconPaw,
	IconPick,
	IconPlant2,
	IconSettings,
	IconSkull,
	IconSparkles,
	IconTree,
	IconUmbrella,
} from "@tabler/icons-react";

export type SourceType =
	| "shop"
	| "forage"
	| "crop"
	| "animal"
	| "machine"
	| "craft"
	| "cook"
	| "mining"
	| "monster"
	| "tree"
	| "island"
	| "fish"
	| "other";

export interface IngredientSource {
	type: SourceType;
	text: string;
}

export interface RecipeUsage {
	/** Display name of the recipe that uses this ingredient */
	name: string;
	/** How many of this ingredient the recipe needs */
	quantity: number;
	/** 0 = unknown recipe, 1 = known but not made yet */
	status: 0 | 1;
}

interface Props {
	/**
	 * The ID of the object/big-craftable/category to display
	 */
	itemID: string;

	/**
	 * Number to display as the needed count in the card
	 */
	count: number;

	/**
	 * How many the player owns (backpack + storage). Undefined when the save
	 * didn't include inventory data (e.g. uploaded before this feature).
	 */
	have?: number;

	/**
	 * The unfinished recipes that use this ingredient.
	 */
	usedIn?: RecipeUsage[];

	/**
	 * Whether the ingredient can be obtained in the player's current season.
	 * Undefined when the season isn't known.
	 */
	inSeason?: boolean;
}

interface Item {
	isCategory: boolean;
	isBC: boolean;
	minVersion: string;
	name: string;
	iconURL: string;
	description?: string;
	wikiName: string;
}

const categoryItems: Record<string, string> = {
	"-4": "Any Fish",
	"-5": "Any Egg",
	"-6": "Any Milk",
	"-777": "Wild Seeds (Any)",
};

const categoryWikiNames: Record<string, string> = {
	"-4": "Fish",
	"-5": "Egg",
	"-6": "Milk",
	"-777": "Wild_Seeds",
};

const sourceIcons: Record<SourceType, typeof IconLeaf> = {
	shop: IconBuildingStore,
	forage: IconLeaf,
	crop: IconPlant2,
	animal: IconPaw,
	machine: IconSettings,
	craft: IconHammer,
	cook: IconChefHat,
	mining: IconPick,
	monster: IconSkull,
	tree: IconTree,
	island: IconUmbrella,
	fish: IconFish,
	other: IconSparkles,
};

export function IngredientMinVersion(itemID: string): string {
	if (itemID.startsWith("-")) {
		return "1.5.0";
	} else if (deweaponize(itemID).key === "BC") {
		const item_id = deweaponize(itemID).value;
		return bigCraftables[item_id as keyof typeof bigCraftables].minVersion;
	}

	return objects[itemID as keyof typeof objects].minVersion;
}

export function IngredientName(itemID: string): string {
	// if itemID is less than 0, it's a category
	if (itemID.startsWith("-")) {
		return categoryItems[itemID];
	} else if (deweaponize(itemID).key === "BC") {
		const item_id = deweaponize(itemID).value;
		return bigCraftables[item_id as keyof typeof bigCraftables].name;
	} else {
		return objects[itemID as keyof typeof objects].name;
	}
}

/**
 * Every way to obtain an ingredient. Fish are built from fish.json so their
 * locations, seasons, times and weather stay in one place; everything else
 * comes from the curated ingredient_sources.json.
 */
export function IngredientSources(itemID: string): IngredientSource[] {
	if (itemID in fishes) {
		const fish = fishes[itemID as keyof typeof fishes] as FishType;
		const sources: IngredientSource[] = fish.locations.map((location) => ({
			type: "fish",
			text: fish.trapFish ? location : `Fish: ${location}`,
		}));

		if (!fish.trapFish) {
			const details = [
				fish.seasons.length === 4 ? "Any season" : fish.seasons.join(", "),
				fish.time,
				fish.weather === "Both" ? "Any weather" : fish.weather,
			].filter(Boolean);
			sources.push({ type: "fish", text: details.join(" · ") });
		}

		return sources;
	}

	return (
		(ingredientSources as Record<string, IngredientSource[]>)[itemID] ?? []
	);
}

function GetItemDetails(itemID: string): Item {
	// if itemID is less than 0, it's a category
	if (itemID.startsWith("-")) {
		return {
			isCategory: true,
			isBC: false,
			minVersion: "1.5.0",
			name: categoryItems[itemID],
			iconURL: `https://cdn.stardew.app/images/(C)${itemID}.webp`,
			wikiName: categoryWikiNames[itemID],
		};
	} else if (deweaponize(itemID).key === "BC") {
		const item_id = deweaponize(itemID).value;
		let item = bigCraftables[item_id as keyof typeof bigCraftables];

		return {
			isCategory: false,
			isBC: true,
			minVersion: item.minVersion,
			name: item.name,
			iconURL: `https://cdn.stardew.app/images/(BC)${deweaponize(itemID).value}.webp`,
			description: item.description,
			wikiName: item.name.replaceAll(" ", "_"),
		};
	} else {
		let item = objects[itemID as keyof typeof objects];

		return {
			isCategory: false,
			isBC: false,
			minVersion: item.minVersion,
			name: item.name,
			iconURL: `https://cdn.stardew.app/images/(O)${itemID}.webp`,
			description: item.description ?? undefined,
			wikiName: item.name.replaceAll(" ", "_"),
		};
	}
}

export const IngredientCard = ({
	itemID,
	count,
	have,
	usedIn = [],
	inSeason,
}: Props) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [fishOpen, setFishOpen] = useState(false);

	const item = GetItemDetails(itemID);
	const sources = IngredientSources(itemID);
	const isFish = itemID in fishes;
	const fish = isFish
		? (fishes[itemID as keyof typeof fishes] as FishType)
		: null;

	const hasInventory = typeof have === "number";
	const short = hasInventory ? Math.max(count - have, 0) : count;
	const ready = hasInventory && short === 0;

	const knownUses = usedIn.filter((u) => u.status === 1);
	const unknownUses = usedIn.filter((u) => u.status === 0);

	return (
		<>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger asChild>
					<div
						className={cn(
							"relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-left text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50",
							ready
								? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
								: "border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800",
						)}
					>
						<div className="flex min-w-0 items-center space-x-3 text-left">
							<Image
								src={item.iconURL}
								alt={item.name}
								className="rounded-sm"
								width={32}
								height={32}
							/>
							<div className="min-w-0 flex-1 pr-3">
								<p className="truncate font-medium">
									{hasInventory
										? `${item.name} (${Math.min(have, count)}/${count})`
										: `${item.name} (${count}x)`}
								</p>
								<p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
									{ready
										? "You have enough"
										: [
												inSeason === false ? "Out of season" : null,
												sources[0]?.text ?? item.description,
											]
												.filter(Boolean)
												.join(" · ")}
								</p>
							</div>
						</div>
						<IconChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
					</div>
				</DialogTrigger>
				<DialogContent className="max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<Image
							src={item.iconURL}
							alt={item.name}
							className="mx-auto rounded-sm"
							width={42}
							height={42}
						/>
						<DialogTitle className="text-center">{item.name}</DialogTitle>
						<DialogDescription className="text-center">
							{item.description}
						</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-3 gap-2 text-center">
						<div className="rounded-lg border p-2 dark:border-neutral-800">
							<p className="text-xs text-neutral-500 dark:text-neutral-400">
								Needed
							</p>
							<p className="text-lg font-semibold">{count}</p>
						</div>
						<div className="rounded-lg border p-2 dark:border-neutral-800">
							<p className="text-xs text-neutral-500 dark:text-neutral-400">
								You have
							</p>
							<p className="text-lg font-semibold">
								{hasInventory ? have : "?"}
							</p>
						</div>
						<div
							className={cn(
								"rounded-lg border p-2 dark:border-neutral-800",
								ready && "border-green-900 bg-green-500/10",
							)}
						>
							<p className="text-xs text-neutral-500 dark:text-neutral-400">
								Still need
							</p>
							<p className="text-lg font-semibold">
								{hasInventory ? short : "?"}
							</p>
						</div>
					</div>
					{!hasInventory && (
						<p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
							Re-upload your save to see how many you already own.
						</p>
					)}

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-semibold">How to get it</h3>
							{inSeason !== undefined && (
								<Badge variant={inSeason ? "secondary" : "outline"}>
									{inSeason ? "Available this season" : "Out of season"}
								</Badge>
							)}
						</div>
						{sources.length > 0 ? (
							<ul className="space-y-1.5">
								{sources.map((source, idx) => {
									const Icon = sourceIcons[source.type] ?? IconSparkles;
									return (
										<li
											key={idx}
											className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
										>
											<Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
											<span>{source.text}</span>
										</li>
									);
								})}
							</ul>
						) : (
							<p className="text-sm text-neutral-500 dark:text-neutral-400">
								Check the wiki page for sources.
							</p>
						)}
					</div>

					{inSeason === false && sources.some((s) => s.type === "crop") && (
						<p className="text-xs text-neutral-500 dark:text-neutral-400">
							Crops can still be grown out of season in the Greenhouse, in
							Garden Pots indoors, or on Ginger Island.
						</p>
					)}

					{usedIn.length > 0 && (
						<div className="space-y-2">
							<h3 className="text-sm font-semibold">Needed for</h3>
							{[
								{ label: "Known recipes", uses: knownUses },
								{ label: "Recipes you haven't learned", uses: unknownUses },
							]
								.filter((group) => group.uses.length > 0)
								.map((group) => (
									<div key={group.label}>
										<p className="text-xs text-neutral-500 dark:text-neutral-400">
											{group.label}
										</p>
										<p className="text-sm text-neutral-700 dark:text-neutral-300">
											{group.uses
												.map((u) =>
													u.quantity > 1 ? `${u.name} (${u.quantity})` : u.name,
												)
												.join(", ")}
										</p>
									</div>
								))}
						</div>
					)}

					<DialogFooter className="gap-3 sm:justify-between sm:gap-0">
						<Button variant="outline">
							<a
								className="flex items-center"
								target="_blank"
								rel="noreferrer"
								href={`https://stardewvalleywiki.com/${item.wikiName}`}
							>
								Visit Wiki Page
								<IconExternalLink className="h-4"></IconExternalLink>
							</a>
						</Button>
						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2">
							{isFish && (
								<Button
									variant="secondary"
									onClick={() => {
										setDialogOpen(false);
										setFishOpen(true);
									}}
								>
									Fish details
								</Button>
							)}
							<Button variant="secondary" onClick={() => setDialogOpen(false)}>
								Close
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{isFish && (
				<FishSheet
					open={fishOpen}
					setIsOpen={setFishOpen}
					fish={fish}
					showCaught={false}
				/>
			)}
		</>
	);
};
