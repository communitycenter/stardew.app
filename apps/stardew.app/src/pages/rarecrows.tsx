import { usePlayers } from "@/contexts/players-context";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";

import { DialogCard } from "@/components/cards/dialog-card";
import { Command, CommandInput } from "@/components/ui/command";

import { BulkActionDialog } from "@/components/dialogs/bulk-action-dialog";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMultiSelect } from "@/contexts/multi-select-context";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

import big_craftables from "@/data/big_craftables.json";

const inter = Inter({ subsets: ["latin"] });

const RARECROW_IDS = [110, 138, 126, 136, 139, 137, 113, 140];

const RARECROW_DATA: Record<
	number,
	(typeof big_craftables)[keyof typeof big_craftables]
> = RARECROW_IDS.reduce(
	(acc, id) => {
		acc[id] = big_craftables[id as unknown as keyof typeof big_craftables];
		return acc;
	},
	{} as Record<number, (typeof big_craftables)[keyof typeof big_craftables]>,
);

// TODO: move to CDN
const RARECROW_IMAGES: Record<number, string> = {
	110: "https://stardewvalleywiki.com/mediawiki/images/6/62/Rarecrow_1.png",
	113: "https://stardewvalleywiki.com/mediawiki/images/2/28/Rarecrow_2.png",
	126: "https://stardewvalleywiki.com/mediawiki/images/e/ea/Rarecrow_3.png",
	136: "https://stardewvalleywiki.com/mediawiki/images/e/ef/Rarecrow_4.png",
	137: "https://stardewvalleywiki.com/mediawiki/images/9/9f/Rarecrow_5.png",
	138: "https://stardewvalleywiki.com/mediawiki/images/2/29/Rarecrow_6.png",
	139: "https://stardewvalleywiki.com/mediawiki/images/5/52/Rarecrow_7.png",
	140: "https://stardewvalleywiki.com/mediawiki/images/b/bb/Rarecrow_8.png",
} as const;

const bubbleColors: Record<string, string> = {
	"0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // unfound
	"2": "border-green-900 bg-green-500/20", // found
};

export default function RarecrowsPage() {
	const { activePlayer, patchPlayer } = usePlayers();
	const [rarecrowsFound, setRarecrowsFound] = useState<Set<string>>(new Set());

	const [_filter, setFilter] = useState("all");

	const [search, setSearch] = useState("");

	const {
		isMultiSelectMode,
		toggleMultiSelectMode,
		selectedItems,
		clearSelection,
	} = useMultiSelect();
	const [bulkActionOpen, setBulkActionOpen] = useState(false);

	useEffect(() => {
		if (activePlayer && Array.isArray(activePlayer.rarecrows)) {
			setRarecrowsFound(new Set(activePlayer.rarecrows.map(String)));
		} else {
			setRarecrowsFound(new Set());
		}
	}, [activePlayer]);

	const displayedRarecrows = RARECROW_IDS.filter((id) => {
		if (_filter === "0") {
			return !rarecrowsFound.has(id.toString());
		} else if (_filter === "2") {
			return rarecrowsFound.has(id.toString());
		} else return true; // all
	}).sort((a, b) => a - b); // Sort by ID numerically

	// Custom bulk action handler for rarecrows
	const handleRarecrowBulkAction = async (
		status: number | null,
		selectedItems: Set<string>,
		close: () => void,
	) => {
		if (!activePlayer) return;
		const current = new Set(activePlayer.rarecrows || []);
		selectedItems.forEach((id) => {
			if (status === 2) current.add(id);
			if (status === 0) current.delete(id);
		});
		await patchPlayer({
			rarecrows: Array.from(current),
		});
		close();
	};

	return (
		<>
			<Head>
				<meta
					name="title"
					content="Stardew Valley Rarecrows Tracker | stardew.app"
				/>
				<title>Stardew Valley Rarecrows Tracker | stardew.app</title>
				<meta
					name="description"
					content="Track and collect Rarecrows in Stardew Valley. Keep tabs on the Rarecrows you've found and monitor your progress towards collecting them all. Collect all 8 unique rarecrows to unlock the Deluxe Scarecrow recipe."
				/>
				<meta
					name="og:description"
					content="Track and collect Rarecrows in Stardew Valley. Keep tabs on the Rarecrows you've found and monitor your progress towards collecting them all. Collect all 8 unique rarecrows to unlock the Deluxe Scarecrow recipe."
				/>
				<meta
					name="twitter:description"
					content="Track and collect Rarecrows in Stardew Valley. Keep tabs on the Rarecrows you've found and monitor your progress towards collecting them all. Collect all 8 unique rarecrows to unlock the Deluxe Scarecrow recipe."
				/>
				<meta
					name="keywords"
					content="stardew valley rarecrow tracker, stardew valley rarecrows, stardew valley rarecrow collection, stardew valley deluxe scarecrow, stardew valley gameplay tracker, stardew valley, stardew, rarecrow tracker"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 dark:border-neutral-800 md:border-l ${inter.className} px-8 py-2`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Rarecrow Tracker
					</h1>
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
								<ToggleGroupItem value="0" aria-label="Show Unfound">
									<span
										className={cn(
											"inline-block h-4 w-4 rounded-full border align-middle",
											bubbleColors["0"],
										)}
									/>
									<span className="align-middle">
										Unfound ({RARECROW_IDS.length - rarecrowsFound.size})
									</span>
								</ToggleGroupItem>
								<ToggleGroupItem value="2" aria-label="Show Found">
									<span
										className={cn(
											"inline-block h-4 w-4 rounded-full border align-middle",
											bubbleColors["2"],
										)}
									/>
									<span className="align-middle">
										Found ({rarecrowsFound.size})
									</span>
								</ToggleGroupItem>
							</ToggleGroup>
						</div>
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
								placeholder="Search Rarecrows"
							/>
						</Command>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{displayedRarecrows
							.filter((id) => {
								if (!search) return true;
								const rarecrowName = RARECROW_DATA[id].name;
								return rarecrowName
									.toLowerCase()
									.includes(search.toLowerCase());
							})
							.map((id) => {
								return (
									<DialogCard
										key={id}
										title={RARECROW_DATA[id].name}
										description={RARECROW_DATA[id].description}
										iconURL={RARECROW_IMAGES[id]}
										completed={rarecrowsFound.has(id.toString())}
										_id={id.toString()}
										_type="rarecrow"
									/>
								);
							})}
					</div>
				</div>
				<BulkActionDialog
					open={bulkActionOpen}
					setOpen={setBulkActionOpen}
					type="rarecrow"
					onBulkAction={handleRarecrowBulkAction}
				/>
			</main>
		</>
	);
}
