import { X } from "lucide-react";
import Head from "next/head";

import achievements from "@/data/achievements.json";
import recipes from "@/data/cooking.json";
import objects from "@/data/objects.json";

import type { Recipe } from "@/types/recipe";

import { useMultiSelect } from "@/contexts/multi-select-context";
import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";
import { useEffect, useMemo, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { RecipeCard } from "@/components/cards/recipe-card";
import { BulkActionDialog } from "@/components/dialogs/bulk-action-dialog";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { FilterSearch } from "@/components/filter-btn";
import { RecipeSheet } from "@/components/sheets/recipe-sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import { IngredientList } from "@/components/ingredient-list";
import { IconClock } from "@tabler/icons-react";

const semverGte = require("semver/functions/gte");

const reqs: Record<string, number> = {
	"Cook": 10,
	"Sous Chef": 25,
	"Gourmet Chef": Object.keys(recipes).length, // 1.6 default
};

const bubbleColors: Record<string, string> = {
	"0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // unknown or not completed
	"1": "border-yellow-900 bg-yellow-500/20", // known, but not completed
	"2": "border-green-900 bg-green-500/20", // completed
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

export default function Cooking() {
	const [open, setIsOpen] = useState(false);
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [playerRecipes, setPlayerRecipes] = useState<{
		[key: string]: 0 | 1 | 2;
	}>({});

	const [gameVersion, setGameVersion] = useState("1.6.0");

	const [search, setSearch] = useState("");
	const [ingredientSearch, setIngredientSearch] = useState("");
	const [_filter, setFilter] = useState("all");
	const [bulkActionOpen, setBulkActionOpen] = useState(false);

	const [showPrompt, setPromptOpen] = useState(false);

	const { activePlayer } = usePlayers();
	const { show, toggleShow, showBetaFeatures } = usePreferences();
	const {
		isMultiSelectMode,
		toggleMultiSelectMode,
		selectedItems,
		clearSelection,
	} = useMultiSelect();

	const [_seasonFilter, setSeasonFilter] = useState("all");

	useEffect(() => {
		if (activePlayer) {
			if (activePlayer.cooking?.recipes) {
				setPlayerRecipes(activePlayer.cooking.recipes);
			} else setPlayerRecipes({});

			// update the requirements for achievements and set the minimum game version
			if (activePlayer.general?.gameVersion) {
				const version = activePlayer.general.gameVersion;
				setGameVersion(version);

				reqs["Gourmet Chef"] = Object.values(recipes).filter((r) =>
					semverGte(version, r.minVersion),
				).length;
			}
		}
	}, [activePlayer]);

	const cookedCount = useMemo(() => {
		if (!activePlayer || !activePlayer.cooking?.recipes) return 0;

		return Object.values(activePlayer.cooking.recipes).filter((r) => r > 1)
			.length;
	}, [activePlayer]);

	// tracks how many recipes the players knows but has not cooked
	const knownCount = useMemo(() => {
		if (!activePlayer || !activePlayer.cooking?.recipes) return 0;

		return Object.values(activePlayer.cooking.recipes).filter((r) => r === 1)
			.length;
	}, [activePlayer]);

	const getAchievementProgress = (name: string) => {
		let completed = false;
		let additionalDescription = "";

		if (!activePlayer) {
			return { completed, additionalDescription };
		}

		completed = cookedCount >= reqs[name];

		if (!completed) {
			additionalDescription = ` - ${reqs[name] - cookedCount} left`;
		}
		return { completed, additionalDescription };
	};

	return (
		<>
			<Head>
				<title>Stardew Valley Cooking Tracker | stardew.app</title>
				<meta
					name="title"
					content="Stardew Valley Cooking Recipes | stardew.app"
				/>
				<meta
					name="description"
					content="Find and discover new cooking recipes in the Stardew Valley 1.6 update. Keep track of the recipes you've learned and monitor your progress towards becoming a skilled chef."
				/>
				<meta
					name="og:description"
					content="Find and discover new cooking recipes in the Stardew Valley 1.6 update. Keep track of the recipes you've learned and monitor your progress towards becoming a skilled chef."
				/>
				<meta
					name="twitter:description"
					content="Find and discover new cooking recipes in the Stardew Valley 1.6 update. Keep track of the recipes you've learned and monitor your progress towards becoming a skilled chef."
				/>
				<meta
					name="keywords"
					content="stardew valley cooking recipe tracker, stardew valley cooking recipes, stardew valley recipe collection, stardew valley skilled chef, stardew valley recipe progress, stardew valley culinary skills, stardew valley gameplay tracker, stardew valley, stardew, cooking tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Cooking Tracker
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
											.filter((a) => a.description.includes("Cook"))
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
					{/* Needed Ingredients Section */}
					{showBetaFeatures && (
						<Accordion type="single" collapsible asChild>
							<section className="space-y-3">
								<AccordionItem value="item-1">
									<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
										Needed Ingredients
									</AccordionTrigger>
									<AccordionContent asChild>
										{/* Filters and Actions Row */}
										<div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
													<ToggleGroupItem value="0" aria-label="Show Unknown">
														<span
															className={cn(
																"inline-block h-4 w-4 rounded-full border align-middle",
																bubbleColors["0"],
															)}
														/>
														<span className="align-middle">
															Unknown (
															{reqs["Gourmet Chef"] -
																(knownCount + cookedCount)}
															)
														</span>
													</ToggleGroupItem>
													<ToggleGroupItem value="1" aria-label="Show Known">
														<span
															className={cn(
																"inline-block h-4 w-4 rounded-full border align-middle",
																bubbleColors["1"],
															)}
														/>
														<span className="align-middle">
															Known ({knownCount})
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
										<div className="my-2 w-full">
											<Command className="w-full border border-b-0 dark:border-neutral-800">
												<CommandInput
													onValueChange={(v) => setIngredientSearch(v)}
													placeholder="Search Ingredients"
												/>
											</Command>
										</div>
										<IngredientList<Recipe>
											recipes={recipes}
											playerRecipes={playerRecipes}
											show={show}
											setPromptOpen={setPromptOpen}
											filterKnown={_filter}
											filterSeason={_seasonFilter}
											searchText={ingredientSearch}
										/>
									</AccordionContent>
								</AccordionItem>
							</section>
						</Accordion>
					)}
					{/* All Recipes Section */}
					<section className="space-y-3">
						<h3 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
							All Recipes
						</h3>
						{/* Filters and Actions Row */}
						<div className="flex w-full flex-row items-center justify-between">
							<ToggleGroup
								variant="outline"
								type="single"
								value={_filter}
								onValueChange={(val) =>
									setFilter(val === _filter ? "all" : val)
								}
								className="gap-2"
							>
								<ToggleGroupItem value="0" aria-label="Show Unknown">
									<span
										className={cn(
											"inline-block h-4 w-4 rounded-full border align-middle",
											bubbleColors["0"],
										)}
									/>
									<span className="align-middle">
										Unknown ({reqs["Gourmet Chef"] - (knownCount + cookedCount)}
										)
									</span>
								</ToggleGroupItem>
								<ToggleGroupItem value="1" aria-label="Show Known">
									<span
										className={cn(
											"inline-block h-4 w-4 rounded-full border align-middle",
											bubbleColors["1"],
										)}
									/>
									<span className="align-middle">Known ({knownCount})</span>
								</ToggleGroupItem>
								<ToggleGroupItem value="2" aria-label="Show Cooked">
									<span
										className={cn(
											"inline-block h-4 w-4 rounded-full border align-middle",
											bubbleColors["2"],
										)}
									/>
									<span className="align-middle">Cooked ({cookedCount})</span>
								</ToggleGroupItem>
							</ToggleGroup>
							<div className="flex flex-row items-center gap-2">
								<Button
									variant={isMultiSelectMode ? "default" : "outline"}
									onClick={() => {
										if (isMultiSelectMode) {
											setBulkActionOpen(true);
										} else {
											toggleMultiSelectMode();
										}
									}}
									disabled={
										!activePlayer ||
										(isMultiSelectMode && selectedItems.size === 0)
									}
								>
									{isMultiSelectMode
										? `Bulk Action (${selectedItems.size})`
										: "Select Multiple"}
								</Button>
								{isMultiSelectMode && (
									<Button
										variant="outline"
										size="icon"
										className="ml-1"
										onClick={() => {
											clearSelection();
											toggleMultiSelectMode();
										}}
										aria-label="Cancel Multi-Select"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>
						{/* Search Bar Row */}
						<div className="mt-2 w-full">
							<Command className="w-full border border-b-0 dark:border-neutral-800">
								<CommandInput
									onValueChange={(v) => setSearch(v)}
									placeholder="Search Recipes"
								/>
							</Command>
						</div>
						{/* Cards */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
							{Object.values(recipes)
								.filter((r) => semverGte(gameVersion, r.minVersion))
								.filter((r) => {
									if (!search) return true;
									const name = objects[r.itemID as keyof typeof objects].name;
									return name.toLowerCase().includes(search.toLowerCase());
								})
								.filter((r) => {
									if (_filter === "0") {
										// unknown recipes (not in playerRecipes)
										return !(
											r.itemID in playerRecipes && playerRecipes[r.itemID] > 0
										);
									} else if (_filter === "1") {
										// known recipes (in playerRecipes) and not cooked
										return (
											r.itemID in playerRecipes && playerRecipes[r.itemID] === 1
										);
									} else if (_filter === "2") {
										// cooked recipes (in playerRecipes) and cooked
										return (
											r.itemID in playerRecipes && playerRecipes[r.itemID] === 2
										);
									} else return true; // all recipes
								})
								.map((f, index, filteredRecipes) => (
									<RecipeCard
										key={f.itemID}
										recipe={f}
										status={
											f.itemID in playerRecipes ? playerRecipes[f.itemID] : 0
										}
										setIsOpen={setIsOpen}
										setObject={setRecipe}
										setPromptOpen={setPromptOpen}
										show={show}
										index={index}
										allRecipes={filteredRecipes}
									/>
								))}
						</div>
					</section>
				</div>
				<RecipeSheet open={open} setIsOpen={setIsOpen} recipe={recipe} />
				<UnblurDialog
					open={showPrompt}
					setOpen={setPromptOpen}
					toggleShow={toggleShow}
				/>
				<BulkActionDialog
					open={bulkActionOpen}
					setOpen={setBulkActionOpen}
					type="cooking"
				/>
			</main>
		</>
	);
}
