import type { WalnutType } from "@/types/items";

import walnut_data from "@/data/walnuts.json";
const walnuts = walnut_data as { [key: string]: WalnutType };

import Head from "next/head";

import { usePlayers } from "@/contexts/players-context";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";

import { DialogCard } from "@/components/cards/dialog-card";
import { FilterSearch } from "@/components/filter-btn";
import { Command, CommandInput } from "@/components/ui/command";

import { BulkActionDialog } from "@/components/dialogs/bulk-action-dialog";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMultiSelect } from "@/contexts/multi-select-context";
import { cn } from "@/lib/utils";
import { IconMapPin } from "@tabler/icons-react";
import { X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const type = [
	{
		value: "all",
		label: "All Walnuts",
	},
	{
		value: "jungle",
		label: "Island Jungle",
	},
	{
		value: "south",
		label: "Island South",
	},
	{
		value: "north",
		label: "Island North",
	},
	{
		value: "west",
		label: "Island West",
	},
	{
		value: "field office",
		label: "Field Office",
	},
	{
		value: "farm",
		label: "Island Farm",
	},
	{
		value: "volcano",
		label: "Volcano",
	},
];

const bubbleColors: Record<string, string> = {
	"0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // unfound
	"2": "border-green-900 bg-green-500/20", // found
};

export default function IslandWalnuts() {
	const { activePlayer, patchPlayer } = usePlayers();
	const [walnutsFound, setWalnutsFound] = useState<Set<string>>(new Set());

	const [_filter, setFilter] = useState("all");
	const [_locationFilter, setLocationFilter] = useState("all");

	const [search, setSearch] = useState("");

	const {
		isMultiSelectMode,
		toggleMultiSelectMode,
		selectedItems,
		clearSelection,
	} = useMultiSelect();
	const [bulkActionOpen, setBulkActionOpen] = useState(false);

	useEffect(() => {
		if (activePlayer && activePlayer.walnuts?.found) {
			// take the walnut IDs in walnutFound and add them to a set
			const foundArray = Object.entries(activePlayer.walnuts.found).filter(
				([id, amount]) => {
					return walnuts[id].count === amount;
				},
			);
			const foundIds = new Set(
				foundArray.map((props) => {
					return props[0];
				}),
			);
			setWalnutsFound(foundIds);
		}
	}, [activePlayer]);

	const displayedWalnuts = useMemo(() => {
		return Object.entries(walnuts).filter(([id]) => {
			if (_filter === "0") {
				return !walnutsFound.has(id);
			} else if (_filter === "2") {
				return walnutsFound.has(id);
			} else return true; // all
		});
	}, [walnutsFound, _filter]);

	// Custom bulk action handler for walnuts
	const handleWalnutBulkAction = async (
		status: number | null,
		selectedItems: Set<string>,
		close: () => void,
	) => {
		if (!activePlayer) return;
		const current = { ...activePlayer.walnuts?.found };
		selectedItems.forEach((id) => {
			if (status === 2) current[id] = walnuts[id].count;
			if (status === 0) current[id] = 0;
		});
		await patchPlayer({
			walnuts: { found: current },
		});
		close();
	};

	return (
		<>
			<Head>
				<meta
					name="title"
					content="Stardew Valley Golden Walnuts Tracker | stardew.app"
				/>
				<title>Stardew Valley Golden Walnuts Tracker | stardew.app</title>
				<meta
					name="description"
					content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
				/>
				<meta
					name="og:description"
					content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
				/>
				<meta
					name="twitter:description"
					content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
				/>
				<meta
					name="keywords"
					content="stardew valley Golden Walnut tracker, stardew valley Golden Walnuts, stardew valley Golden Walnut locations, stardew valley Golden Walnut rewards, stardew valley Golden Walnut collection, stardew valley gameplay tracker, stardew valley, stardew, Golden Walnut tracker"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 dark:border-neutral-800 md:border-l ${inter.className} px-8 py-2`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Golden Walnut Tracker
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
										Unfound (
										{130 -
											Object.entries(activePlayer?.walnuts?.found ?? {}).reduce(
												(a, b) => a + b[1],
												0,
											)}
										)
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
										Found (
										{Object.entries(activePlayer?.walnuts?.found ?? {}).reduce(
											(a, b) => a + b[1],
											0,
										)}
										)
									</span>
								</ToggleGroupItem>
							</ToggleGroup>
						</div>
						<div className="flex flex-row items-center gap-2">
							<FilterSearch
								_filter={_locationFilter}
								title={"Location"}
								data={type}
								setFilter={setLocationFilter}
								icon={IconMapPin}
							/>
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
								placeholder="Search Walnuts"
							/>
						</Command>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{displayedWalnuts
							.filter((f) => {
								if (!search) return true;
								const name = walnuts[f[0]].name;
								return name.toLowerCase().includes(search.toLowerCase());
							})
							.filter((f) => {
								if (_locationFilter === "all") return true;
								return walnuts[f[0]].name
									.toLowerCase()
									.includes(_locationFilter);
							})
							.map(([id, walnut]) => {
								return (
									<DialogCard
										key={id}
										title={`${walnut.name} ${
											walnut.count > 1 ? `(${walnut.count}x)` : ""
										}`}
										description={walnut.description}
										iconURL="https://stardewvalleywiki.com/mediawiki/images/5/54/Golden_Walnut.png"
										completed={
											activePlayer
												? activePlayer.walnuts?.found?.[id]
													? activePlayer.walnuts?.found?.[id] == walnut.count
													: false
												: false
										}
										_id={id}
										_type="walnut"
									/>
								);
							})}
					</div>
				</div>
				<BulkActionDialog
					open={bulkActionOpen}
					setOpen={setBulkActionOpen}
					type="museum"
					onBulkAction={handleWalnutBulkAction}
				/>
			</main>
		</>
	);
}
