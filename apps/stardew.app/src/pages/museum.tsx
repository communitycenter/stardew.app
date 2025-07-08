import Head from "next/head";

import achievements from "@/data/achievements.json";
import museum from "@/data/museum.json";
import objects from "@/data/objects.json";

import { MuseumItem } from "@/types/items";
import { useMemo, useState } from "react";

import { AchievementCard } from "@/components/cards/achievement-card";
import { BooleanCard } from "@/components/cards/boolean-card";
import { BulkActionDialog } from "@/components/dialogs/bulk-action-dialog";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import { MuseumSheet } from "@/components/sheets/museum-sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMultiSelect } from "@/contexts/multi-select-context";
import { usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const reqs: Record<string, number> = {
	"A Complete Collection": Object.values(museum).flatMap((item) =>
		Object.values(item),
	).length,
	"Treasure Trove": 40,
};

const bubbleColors: Record<string, string> = {
	"0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // not donated
	"2": "border-green-900 bg-green-500/20", // donated
};

export default function Museum() {
	const [open, setIsOpen] = useState(false);
	const [museumArtifact, setMuseumArtifact] = useState<MuseumItem | null>(null);

	const [_artifactFilter, setArtifactFilter] = useState("all");
	const [_mineralFilter, setMineralFilter] = useState("all");

	const { activePlayer } = usePlayers();
	const { show, toggleShow } = usePreferences();

	// unblur dialog
	const [showPrompt, setPromptOpen] = useState(false);

	const [museumArtifactCollected, museumMineralCollected] = useMemo(
		() => [
			new Set<string>(activePlayer?.museum?.artifacts ?? []),
			new Set<string>(activePlayer?.museum?.minerals ?? []),
		],
		[activePlayer],
	);

	const {
		isMultiSelectMode,
		toggleMultiSelectMode,
		selectedItems,
		clearSelection,
	} = useMultiSelect();
	const [bulkActionOpen, setBulkActionOpen] = useState(false);
	const [bulkType, setBulkType] = useState<"artifact" | "mineral">("artifact");

	const [artifactSearch, setArtifactSearch] = useState("");
	const [mineralSearch, setMineralSearch] = useState("");

	const getAchievementProgress = (name: string) => {
		let completed = false;
		let additionalDescription = "";

		if (!activePlayer || !activePlayer.museum)
			return { completed, additionalDescription };

		const collection =
			museumArtifactCollected.size + museumMineralCollected.size;

		if (Object.hasOwn(reqs, name)) {
			completed = collection >= reqs[name];
			if (!completed) {
				additionalDescription = ` - ${reqs[name] - collection} left`;
			}
		}

		return { completed, additionalDescription };
	};

	const remainingDonations = {
		artifacts:
			Object.values(museum.artifacts).length - museumArtifactCollected.size,
		minerals:
			Object.values(museum.minerals).length - museumMineralCollected.size,
	};

	// Calculate donatedCount for artifacts based on filtered items
	const donatedArtifactCount = Object.values(museum.artifacts).filter((f) =>
		museumArtifactCollected.has(f.itemID),
	).length;

	// Custom bulk action handler for museum
	const { patchPlayer } = usePlayers();
	const handleMuseumBulkAction = async (
		status: number | null,
		selectedItems: Set<string>,
		close: () => void,
	) => {
		if (!activePlayer) return;
		const patch: any = { museum: {} };
		if (bulkType === "artifact") {
			const current = new Set(activePlayer.museum?.artifacts ?? []);
			selectedItems.forEach((id) => {
				if (status === 2) current.add(id);
				if (status === 0) current.delete(id);
			});
			patch.museum.artifacts = Array.from(current);
		} else {
			const current = new Set(activePlayer.museum?.minerals ?? []);
			selectedItems.forEach((id) => {
				if (status === 2) current.add(id);
				if (status === 0) current.delete(id);
			});
			patch.museum.minerals = Array.from(current);
		}
		await patchPlayer(patch);
		close();
	};

	return (
		<>
			<Head>
				<title>stardew.app | Museum</title>
				<meta
					name="title"
					content="Stardew Valley Museum Artifacts | stardew.app"
				/>
				<meta
					name="description"
					content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
				/>
				<meta
					name="og:description"
					content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
				/>
				<meta
					name="twitter:description"
					content="Track your progress in completing the Stardew Valley museum collection. Keep tabs on the artifacts, minerals, and fossils you've donated, and see what items are still missing for 100% completion. Unearth hidden treasures, unravel the mysteries of the past, and become a renowned curator in Stardew Valley."
				/>
				<meta
					name="keywords"
					content="stardew valley museum tracker, stardew valley artifacts, stardew valley minerals, stardew valley fossils, stardew valley museum collection, stardew valley curator, stardew valley 100% completion, stardew valley completionist, stardew valley hidden treasures, stardew valley mysteries, stardew valley past, stardew valley perfection tracker, stardew valley, stardew, stardew museum, stardew valley collectibles, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Museum Tracker
					</h1>
					{/* Achievements Section */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
									Achievements
								</AccordionTrigger>
								<AccordionContent asChild>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										{Object.values(achievements)
											.filter((a) => a.description.includes("museum"))
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
					{/* Artifacts Section */}
					<Accordion type="single" collapsible defaultValue="item-1" asChild>
						<section className="space-y-3">
							<AccordionItem value="item-1">
								<AccordionTrigger className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white">
									All Artifacts
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-3">
										<div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
											<div className="flex flex-row items-center gap-2">
												<ToggleGroup
													variant="outline"
													type="single"
													value={_artifactFilter}
													onValueChange={(val) =>
														setArtifactFilter(
															val === _artifactFilter ? "all" : val,
														)
													}
													className="gap-2"
												>
													<ToggleGroupItem
														value="0"
														aria-label="Show Not Donated"
													>
														<span
															className={cn(
																"inline-block h-4 w-4 rounded-full border align-middle",
																bubbleColors["0"],
															)}
														/>
														<span className="align-middle">
															Not Donated ({remainingDonations.artifacts})
														</span>
													</ToggleGroupItem>
													<ToggleGroupItem value="2" aria-label="Show Donated">
														<span
															className={cn(
																"inline-block h-4 w-4 rounded-full border align-middle",
																bubbleColors["2"],
															)}
														/>
														<span className="align-middle">
															Donated ({donatedArtifactCount})
														</span>
													</ToggleGroupItem>
												</ToggleGroup>
											</div>
											<div className="flex flex-row items-center gap-2">
												<Button
													variant={isMultiSelectMode ? "default" : "outline"}
													onClick={() => {
														setBulkType("artifact");
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
													onValueChange={(v) => setArtifactSearch(v)}
													placeholder="Search Artifacts"
												/>
											</Command>
										</div>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
											{Object.values(museum.artifacts)
												.filter((f) => {
													if (!artifactSearch) return true;
													const name =
														objects[f.itemID as keyof typeof objects]?.name ||
														"";
													return name
														.toLowerCase()
														.includes(artifactSearch.toLowerCase());
												})
												.filter((f) => {
													if (_artifactFilter === "0") {
														return !museumArtifactCollected.has(f.itemID); // incompleted
													} else if (_artifactFilter === "2") {
														return museumArtifactCollected.has(f.itemID); // completed
													} else return true; // all
												})
												.map((f) => (
													<BooleanCard
														key={`artifact-${f.itemID}`}
														item={f}
														completed={museumArtifactCollected.has(f.itemID)}
														setIsOpen={setIsOpen}
														setObject={setMuseumArtifact}
														type="artifact"
														show={show}
													/>
												))}
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</section>
					</Accordion>
					{/* Minerals Section */}
					<section className="space-y-3">
						<h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
							All Minerals
						</h2>
						<div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
							<div className="flex flex-row items-center gap-2">
								<ToggleGroup
									variant="outline"
									type="single"
									value={_mineralFilter}
									onValueChange={(val) =>
										setMineralFilter(val === _mineralFilter ? "all" : val)
									}
									className="gap-2"
								>
									<ToggleGroupItem value="0" aria-label="Show Not Donated">
										<span
											className={cn(
												"inline-block h-4 w-4 rounded-full border align-middle",
												bubbleColors["0"],
											)}
										/>
										<span className="align-middle">
											Not Donated ({remainingDonations.minerals})
										</span>
									</ToggleGroupItem>
									<ToggleGroupItem value="2" aria-label="Show Donated">
										<span
											className={cn(
												"inline-block h-4 w-4 rounded-full border align-middle",
												bubbleColors["2"],
											)}
										/>
										<span className="align-middle">
											Donated ({museumMineralCollected.size})
										</span>
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
							<div className="flex flex-row items-center gap-2">
								<Button
									variant={isMultiSelectMode ? "default" : "outline"}
									onClick={() => {
										setBulkType("mineral");
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
									onValueChange={(v) => setMineralSearch(v)}
									placeholder="Search Minerals"
								/>
							</Command>
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
							{Object.values(museum.minerals)
								.filter((f) => {
									if (!mineralSearch) return true;
									const name =
										objects[f.itemID as keyof typeof objects]?.name || "";
									return name
										.toLowerCase()
										.includes(mineralSearch.toLowerCase());
								})
								.filter((f) => {
									if (_mineralFilter === "0") {
										return !museumMineralCollected.has(f.itemID); // incompleted
									} else if (_mineralFilter === "2") {
										return museumMineralCollected.has(f.itemID); // completed
									} else return true; // all
								})
								.map((f) => (
									<BooleanCard
										key={`mineral-${f.itemID}`}
										item={f as MuseumItem}
										completed={museumMineralCollected.has(f.itemID)}
										setIsOpen={setIsOpen}
										setObject={setMuseumArtifact}
										type="mineral"
										show={show}
									/>
								))}
						</div>
					</section>
				</div>
				<MuseumSheet
					open={open}
					setIsOpen={setIsOpen}
					trinket={museumArtifact}
				/>
				<UnblurDialog
					open={showPrompt}
					setOpen={setPromptOpen}
					toggleShow={toggleShow}
				/>
				<BulkActionDialog
					open={bulkActionOpen}
					setOpen={setBulkActionOpen}
					type="museum"
					onBulkAction={handleMuseumBulkAction}
				/>
			</main>
		</>
	);
}
