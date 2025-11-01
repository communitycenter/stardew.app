import Head from "next/head";

import achievements from "@/data/achievements.json";
import bundlesData from "@/data/bundles.json";

import {
	Bundle,
	BundleItem,
	BundleItemWithLocation,
	BundleItemWithOptions,
	BundleWithStatus,
	BundleWithStatusAndOptions,
	CommunityCenter,
	CommunityCenterRoomName,
	Randomizer,
	isRandomizer,
} from "@/types/bundles";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { PlayerType, usePlayers } from "@/contexts/players-context";
import { usePreferences } from "@/contexts/preferences-context";

import { AchievementCard } from "@/components/cards/achievement-card";
import {
	BundleItemCard,
	bundleItemName,
} from "@/components/cards/bundle-item-card";
import { UnblurDialog } from "@/components/dialogs/unblur-dialog";
import BundleSheet from "@/components/sheets/bundle-sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	AccordionTriggerNoToggle,
} from "@/components/ui/accordion";
import { Command, CommandInput } from "@/components/ui/command";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@react-hook/media-query";
import { IconSettings } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useState } from "react";

export const ItemQualityToString = {
	"0": "Normal",
	"1": "Silver",
	"2": "Gold",
	"3": "Iridium",
};

const bubbleColors: Record<string, string> = {
	"0": "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950", // unknown or not completed
	"1": "border-yellow-900 bg-yellow-500/20", // known, but not completed
	"2": "border-green-900 bg-green-500/20", // completed
};

type BundleAccordionProps = {
	bundleWithStatus: BundleWithStatus;
	children: JSX.Element | JSX.Element[];
	alternateOptions?: Bundle[];
	onChangeBundle?: (bundle: Bundle, bundleWithStatus: BundleWithStatus) => void;
};

type AccordionSectionProps = {
	title: string;
	children: JSX.Element | JSX.Element[];
	completedCount?: number;
};

type FilteredBundle = {
	bundleWithStatus: BundleWithStatus;
	items: (BundleItem | Randomizer)[];
	matchesSearch: boolean;
};

const CommunityCenterRooms: CommunityCenterRoomName[] = [
	"Pantry",
	"Crafts Room",
	"Fish Tank",
	"Boiler Room",
	"Vault",
	"Bulletin Board",
	"Abandoned Joja Mart",
];

function AccordionSection(props: AccordionSectionProps): JSX.Element {
	const { activePlayer } = usePlayers();
	let progressIndicator =
		activePlayer &&
		typeof props.completedCount === "number" &&
		Array.isArray(props.children) &&
		props.completedCount < props.children.length ? (
			<Progress
				value={props.completedCount}
				max={props.children.length}
				className="w-32"
			/>
		) : (
			``
		);
	return (
		<Accordion type="single" collapsible defaultValue="item-1" asChild>
			<section className="space-y-3">
				<AccordionItem value="item-1">
					<AccordionTrigger
						className="ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white"
						pullRight={progressIndicator}
					>
						{props.title}
					</AccordionTrigger>
					<AccordionContent asChild>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{props.children}
						</div>
					</AccordionContent>
				</AccordionItem>
			</section>
		</Accordion>
	);
}

function BundleAccordion(props: BundleAccordionProps): JSX.Element {
	const isDesktop = useMediaQuery("only screen and (min-width: 768px)");
	const { bundle, bundleStatus } = props.bundleWithStatus;

	const totalItems = bundle.items.length;
	const requiredItems =
		bundle.itemsRequired === -1 ? totalItems : bundle.itemsRequired;
	const completedItems = bundleStatus.filter(Boolean).length;
	const remainingCount = requiredItems - completedItems;
	const bundleCompleted = completedItems >= requiredItems;

	const bundleName = props.bundleWithStatus.bundle.name;

	const [selectedBundleName, setSelectedBundleName] = useState(
		props.bundleWithStatus.bundle.name,
	);

	return (
		<Accordion type="single" collapsible defaultValue="item-1" asChild>
			<section
				className={clsx(
					"relative h-min select-none justify-between space-y-3 rounded-lg border px-5 pt-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50",
					bundleCompleted
						? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
						: "border-neutral-200 dark:border-neutral-800",
				)}
			>
				<AccordionItem value="item-1" className="border-none">
					<AccordionTriggerNoToggle
						className={`ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white ${isDesktop ? "flex-row" : "flex-col items-start"}`}
					>
						<div>
							<div className="flex items-center gap-3">
								<span>{bundleName} Bundle</span>
								{props.alternateOptions &&
									props.alternateOptions.length > 0 && (
										<DropdownMenu>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger>
														<DropdownMenuTrigger asChild>
															<IconSettings
																size={16}
																className="relative top-0.5 text-neutral-500 dark:text-neutral-400"
															/>
														</DropdownMenuTrigger>
													</TooltipTrigger>
													<TooltipContent>
														<p>Change Bundle</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>

											<DropdownMenuContent className="w-56">
												<DropdownMenuLabel>Remix Bundles</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuRadioGroup
													value={selectedBundleName}
													onValueChange={(newBundleName) => {
														setSelectedBundleName(newBundleName);
														const selectedBundle = props.alternateOptions?.find(
															(bundle) => bundle.name === newBundleName,
														);
														if (props.onChangeBundle && selectedBundle) {
															props.onChangeBundle(
																selectedBundle,
																props.bundleWithStatus,
															);
														}
													}}
												>
													{props.alternateOptions.map((newBundle) => (
														<DropdownMenuRadioItem
															key={newBundle.name}
															value={newBundle.name}
														>
															{newBundle.localizedName}
														</DropdownMenuRadioItem>
													))}
												</DropdownMenuRadioGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
							</div>
						</div>
						{!bundleCompleted && (
							<div className={`flex items-center ${isDesktop ? "" : "pt-2"}`}>
								<Progress
									value={completedItems}
									max={requiredItems}
									className="w-32"
								/>
							</div>
						)}
					</AccordionTriggerNoToggle>

					<AccordionContent asChild>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{props.children}
						</div>
					</AccordionContent>
				</AccordionItem>
			</section>
		</Accordion>
	);
}

function BundleCompleted(bundleWithStatus: BundleWithStatus): boolean {
	if (!bundleWithStatus.bundleStatus) {
		return false;
	}
	if (bundleWithStatus.bundle.itemsRequired === -1) {
		// Gold bundles are encoded in the save file as requiring -1 items
		return (
			bundleWithStatus.bundleStatus.reduce((acc, cur) => {
				return cur ? acc + 1 : acc;
			}, 0) >= bundleWithStatus.bundle.items.length
		);
	}
	return (
		bundleWithStatus.bundleStatus.reduce((acc, cur) => {
			return cur ? acc + 1 : acc;
		}, 0) >= bundleWithStatus.bundle.itemsRequired
	);
}

function ResolveBundleRandomizer(bundleRandomizer: Randomizer): Bundle[] {
	let selectionCount = bundleRandomizer.selectionCount;
	let relevantBundles = bundleRandomizer.options.slice(
		0,
		selectionCount,
	) as Bundle[];
	let resolvedBundles: Bundle[] = [];
	relevantBundles.forEach((bundle) => {
		resolvedBundles.push(ResolveItemRandomizers(bundle));
	});
	return resolvedBundles;
}

function ResolveItemRandomizers(bundle: Bundle): Bundle {
	let finishedBundle = {
		...bundle,
	};
	if (isRandomizer(bundle.items)) {
		let selectionCount = bundle.items.selectionCount;
		let relevantItems = bundle.items.options.slice(
			0,
			selectionCount,
		) as BundleItem[];
		finishedBundle.items = relevantItems;
	} else {
		let items: BundleItem[] = [];
		bundle.items.forEach((item) => {
			if (isRandomizer(item)) {
				let selectionCount = item.selectionCount;
				let relevantItems = item.options.slice(
					0,
					selectionCount,
				) as BundleItem[];
				items = items.concat(relevantItems);
			} else {
				items.push(item);
			}
		});
		finishedBundle.items = items;
	}
	return finishedBundle;
}

function AttachRandomizerData(
	allBundlesWithStatuses: BundleWithStatus[],
): BundleWithStatus[] {
	// Find and attach alternate bundle options
	CommunityCenterRooms.forEach((roomName) => {
		let roomBundleSpecification = (bundlesData as CommunityCenter)[roomName];
		roomBundleSpecification.forEach((bundleSpecification) => {
			if (isRandomizer(bundleSpecification)) {
				let optionNames = bundleSpecification.options.map(
					(bundle) => (bundle as Bundle).name,
				);
				let currentlySelectedBundles = allBundlesWithStatuses.filter(
					(bundleWithStatus) =>
						optionNames.includes(bundleWithStatus.bundle.name),
				);
				currentlySelectedBundles.forEach((bundleWithStatus) => {
					let options = bundleSpecification.options.map((bundle) => {
						let resolvedBundle = ResolveItemRandomizers(bundle as Bundle);
						return {
							...resolvedBundle,
							localizedName: resolvedBundle.name,
						};
					});
					(bundleWithStatus as BundleWithStatusAndOptions)["options"] = options;
				});
			}
		});
	});

	// Find and attach alternate item options to Bundles
	allBundlesWithStatuses.forEach((bundleWithStatus) => {
		if (
			!bundleWithStatus ||
			!bundleWithStatus.bundle ||
			!bundleWithStatus.bundle.items ||
			!Array.isArray(bundleWithStatus.bundle.items)
		) {
			return;
		}
		let bundle = bundleWithStatus.bundle;
		if (!bundle.areaName) {
			return;
		}
		let items = bundle.items as BundleItem[];
		// Find bundle spec
		const bundleRoomSpec = bundlesData[bundle.areaName];
		const possibleBundles: Bundle[] = [];
		bundleRoomSpec.forEach((bundleSpec) => {
			if (isRandomizer(bundleSpec)) {
				possibleBundles.push(...(bundleSpec.options as Bundle[]));
			} else {
				possibleBundles.push(bundleSpec as Bundle);
			}
		});

		const bundleSpec = possibleBundles.find((b) => b.name === bundle.name);
		if (!bundleSpec) {
			return;
		}
		let index = -1;
		// Iterate over items in spec to find randomizers
		bundleSpec.items.forEach((itemSpec) => {
			index = index + 1;
			if (isRandomizer(itemSpec)) {
				let itemRandomizer = itemSpec;
				let itemOptions = itemRandomizer.options as BundleItem[];
				let selectionCount = itemRandomizer.selectionCount;

				let currentIndex = index;
				while (currentIndex < index + selectionCount) {
					// Attach (randomizer options - used options) to relevant items
					let alternateOptions = itemOptions.filter((newItem) => {
						return !items
							.map((item) => {
								return item.itemID;
							})
							.includes(newItem.itemID);
					});
					(bundle.items[currentIndex] as BundleItemWithOptions).options =
						alternateOptions;
					currentIndex = currentIndex + 1;
				}
				index = currentIndex - 1;
			}
		});
	});

	return allBundlesWithStatuses;
}

function GenerateFreshBundles(): BundleWithStatus[] {
	let allBundlesWithStatuses: BundleWithStatus[] = [];
	CommunityCenterRooms.forEach((roomName) => {
		let roomBundleSpecification = bundlesData[roomName];
		let resolvedBundles: Bundle[] = [];
		roomBundleSpecification.forEach((bundleSpecification) => {
			if (isRandomizer(bundleSpecification)) {
				resolvedBundles.push(...ResolveBundleRandomizer(bundleSpecification));
			} else {
				resolvedBundles.push(
					ResolveItemRandomizers(bundleSpecification as Bundle),
				);
			}
		});
		let roomBundles = resolvedBundles.map((bundle) => {
			let bundleStatus: boolean[] = [];
			bundle.items.forEach(() => {
				bundleStatus.push(false);
			});
			bundle.areaName = roomName;
			bundle.localizedName = bundle.name;
			return {
				bundle,
				bundleStatus,
			};
		});
		allBundlesWithStatuses = allBundlesWithStatuses.concat(roomBundles);
	});
	return allBundlesWithStatuses;
}

export default function Bundles() {
	// unblur dialog
	const [showPrompt, setPromptOpen] = useState(false);
	const { show, toggleShow } = usePreferences();

	let [open, setIsOpen] = useState(false);
	let [object, setObject] = useState<BundleItemWithLocation | null>(null);
	let [bundles, setBundles] = useState<BundleWithStatus[]>([]);
	let [completeCount, setCompleteCount] = useState(0);
	let [incompleteCount, setIncompleteCount] = useState(0);
	let [filter, setFilter] = useState("all");
	let [search, setSearch] = useState("");

	const { activePlayer, patchPlayer } = usePlayers();

	function GetActiveBundles(
		activePlayer: PlayerType | undefined,
	): BundleWithStatus[] {
		let activeBundles: BundleWithStatus[] = [];
		if (activePlayer) {
			if (
				Array.isArray(activePlayer.bundles) &&
				activePlayer.bundles.length > 0
			) {
				activeBundles = activePlayer.bundles;
			} else {
				activeBundles = GenerateFreshBundles();
				patchPlayer({ bundles: activeBundles });
			}
		} else {
			activeBundles = GenerateFreshBundles();
		}
		AttachRandomizerData(activeBundles);
		return activeBundles;
	}

	async function SwapBundle(
		newBundle: Bundle,
		oldBundleWithStatus: BundleWithStatus,
	) {
		let index = bundles.findIndex(
			(b) => b.bundle.name === oldBundleWithStatus.bundle.name,
		);
		// Allow swapping bundles out even if not logged in
		// It won't persist, but it's easy to redo
		if (!activePlayer) {
			let newBundles = [...bundles];
			newBundle.areaName = oldBundleWithStatus.bundle.areaName;
			let newBundleWithStatus = {
				bundle: newBundle,
				bundleStatus: new Array(newBundle.items.length).fill(false),
			};
			newBundles[index] = newBundleWithStatus;
			setBundles(AttachRandomizerData(newBundles));
		} else {
			newBundle.areaName = oldBundleWithStatus.bundle.areaName;
			let patch = {
				bundles: {
					[index]: {
						bundle: newBundle,
						bundleStatus: new Array(newBundle.items.length).fill(false),
						options: null,
					},
				},
			};

			// See note in bundlesheet.tsx
			// @ts-ignore
			await patchPlayer(patch);
		}
	}

	useEffect(() => {
		const activeBundles = GetActiveBundles(activePlayer);
		const _completeCount = activeBundles.filter(BundleCompleted).length;
		const _incompleteCount = activeBundles.length - _completeCount;

		setBundles(activeBundles);
		setCompleteCount(_completeCount);
		setIncompleteCount(_incompleteCount);
	}, [activePlayer]);

	const getAchievementProgress = (name: string) => {
		if (bundles.length < 1) {
			// Guard for this function being called prior to bundles being loaded
			return { completed: false, additionalDescription: "" };
		}

		let completed = false;
		let additionalDescription = "";

		if (name === "Local Legend") {
			let completedCount = bundles.reduce((acc, curBundelRet) => {
				if (BundleCompleted(curBundelRet)) return acc + 1;
				return acc;
			}, 0);
			completed = completedCount >= 30;
			if (!completed) {
				additionalDescription = ` - ${30 - completedCount} bundles left`;
			}
		}

		if (activePlayer?.general?.jojaMembership?.isMember) {
			if (name === "Joja Co. Member Of The Year") {
				let completedCount =
					activePlayer?.general?.jojaMembership?.developmentProjects?.length;
				completed = completedCount >= 5;
				if (!completed) {
					additionalDescription = ` - ${5 - completedCount} projects left`;
				}
			}
		}

		return { completed, additionalDescription };
	};

	return (
		<>
			<Head>
				<title>Stardew Valley Bundles Tracker | stardew.app</title>
				<meta
					name="title"
					content="Stardew Valley Bundles Tracker | stardew.app"
				/>
				<meta
					name="description"
					content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
				/>
				<meta
					name="og:description"
					content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
				/>
				<meta
					name="twitter:description"
					content="Track and manage items needed for bundles in Stardew Valley's Community Center. Keep tabs on the items you've collected and monitor your progress towards completing the bundles. Discover what items are still needed to fulfill each bundle requirement and restore the Community Center to its former glory."
				/>
				<meta
					name="keywords"
					content="stardew valley bundle tracker, stardew valley community center bundles, stardew valley bundle items, stardew valley bundle progress, stardew valley community center restoration, stardew valley gameplay tracker, stardew valley, stardew, bundle tracker, stardew valley, stardew, stardew checkup, stardew bundles, stardew 100% completion, stardew perfection tracker, stardew, valley"
				/>
			</Head>
			<main
				className={`flex min-h-screen justify-center border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
						Bundle Tracker
					</h1>
					<AccordionSection title="Achievements" key="Achievements">
						{Object.values(achievements)
							.filter((a) => a.description.includes("Community"))
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
					</AccordionSection>
					{/* Filters and Actions Row */}
					<div className="flex w-full flex-row items-center justify-between">
						<ToggleGroup
							variant="outline"
							type="single"
							value={filter}
							onValueChange={(val: string) =>
								setFilter(val === filter ? "all" : val)
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
								<span className="align-middle">
									Incomplete ({incompleteCount})
								</span>
							</ToggleGroupItem>
							<ToggleGroupItem value="2" aria-label="Show Complete">
								<span
									className={cn(
										"inline-block h-4 w-4 rounded-full border align-middle",
										bubbleColors["2"],
									)}
								/>
								<span className="align-middle">Complete ({completeCount})</span>
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
					{/* Search Bar Row */}
					<div className="mt-2 w-full">
						<Command className="w-full border border-b-0 dark:border-neutral-800">
							<CommandInput
								onValueChange={(v) => setSearch(v?.toLowerCase())}
								placeholder="Search Bundles"
							/>
						</Command>
					</div>
					{CommunityCenterRooms.map((roomName: CommunityCenterRoomName) => {
						let roomBundles: BundleWithStatus[] = [];
						let completedCount = 0;
						const roomMatched =
							!search || roomName.toLowerCase().includes(search);
						if (activePlayer && Array.isArray(activePlayer.bundles)) {
							roomBundles = activePlayer.bundles.filter((bundleWithStatus) => {
								if (bundleWithStatus?.bundle) {
									return bundleWithStatus.bundle.areaName === roomName;
								} else {
									return false;
								}
							});
							completedCount = roomBundles.reduce((acc, curBundelRet) => {
								if (BundleCompleted(curBundelRet)) return acc + 1;
								return acc;
							}, 0);
						} else {
							roomBundles = bundles.filter(
								(bundleWithStatus) =>
									bundleWithStatus.bundle.areaName === roomName,
							);
						}
						const filteredBundles: FilteredBundle[] = roomBundles
							.filter((bundleWithStatus) => {
								switch (filter) {
									case "0":
										return !BundleCompleted(bundleWithStatus);
									case "2":
										return BundleCompleted(bundleWithStatus);
									case "all":
									default:
										return true;
								}
							})
							.map((bundleWithStatus): FilteredBundle => {
								const bundleMatched =
									roomMatched ||
									bundleWithStatus.bundle.name.toLowerCase().includes(search);

								return {
									bundleWithStatus: bundleWithStatus,
									items: bundleWithStatus.bundle.items
										.filter((_, idx) => {
											switch (filter) {
												case "0":
													return !bundleWithStatus.bundleStatus[idx];
												case "2":
													return bundleWithStatus.bundleStatus[idx];
												case "all":
												default:
													return true;
											}
										})
										.filter((item) => {
											if (bundleMatched) {
												return true;
											}

											return (
												!isRandomizer(item) &&
												bundleItemName(item).toLowerCase().includes(search)
											);
										}),
									matchesSearch: bundleMatched,
								};
							})
							.filter((filteredBundle) => filteredBundle.items.length !== 0);

						if (filteredBundles.length === 0) {
							return;
						}

						return (
							<AccordionSection
								key={roomName}
								title={roomName}
								completedCount={completedCount}
							>
								{filteredBundles.map((filteredBundle: FilteredBundle) => {
									const bundleWithStatus = filteredBundle.bundleWithStatus;
									return (
										<BundleAccordion
											key={bundleWithStatus.bundle.localizedName}
											bundleWithStatus={bundleWithStatus}
											alternateOptions={(
												bundleWithStatus as BundleWithStatusAndOptions
											)?.options?.filter((newBundle) => {
												return !bundles
													.map((bundleWithStatus) => {
														return bundleWithStatus.bundle.name;
													})
													.includes(newBundle.name);
											})}
											onChangeBundle={SwapBundle}
										>
											{filteredBundle.items ? (
												filteredBundle.items.map((item, index: number) => {
													if (isRandomizer(item)) {
														// Guard clause for type coercion
														return <></>;
													}
													const BundleItemWithLocation: BundleItemWithLocation =
														{
															...item,
															index: index,
															bundleID: bundleWithStatus.bundle.name,
														};
													return (
														<BundleItemCard
															key={item.itemID + "-" + index}
															item={BundleItemWithLocation}
															setIsOpen={setIsOpen}
															completed={bundleWithStatus.bundleStatus[index]}
															setObject={setObject}
															show={show}
															setPromptOpen={setPromptOpen}
														/>
													);
												})
											) : (
												<>error</>
											)}
										</BundleAccordion>
									);
								})}
							</AccordionSection>
						);
					})}
					<BundleSheet
						open={open}
						setIsOpen={setIsOpen}
						bundleItemWithLocation={object}
					/>
					<UnblurDialog
						open={showPrompt}
						setOpen={setPromptOpen}
						toggleShow={toggleShow}
					/>
				</div>
			</main>
		</>
	);
}
