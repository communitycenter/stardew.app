import Head from "next/head";

import { useMemo, useState } from "react";

import { usePlayers } from "@/contexts/players-context";
import { buildBreakdown } from "@/lib/money-breakdown";
import { calculateNetWorth } from "@/lib/net-worth";
import { estimateWeeklyIncome } from "@/lib/weekly-income";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ArrowTrendingUpIcon } from "@heroicons/react/24/solid";

const gold = (n: number) => `${n.toLocaleString()}g`;

export default function Money() {
	const { activePlayer } = usePlayers();
	const [search, setSearch] = useState("");
	const [openRegions, setOpenRegions] = useState<string[]>();

	// saves uploaded before the items column existed hydrate it as {}
	const items = activePlayer?.items?.money ? activePlayer.items : null;

	const netWorth = useMemo(
		() => (items ? calculateNetWorth(items) : null),
		[items],
	);
	const weeklyIncome = useMemo(
		() => (items ? estimateWeeklyIncome(items) : 0),
		[items],
	);
	const breakdown = useMemo(
		() => (items ? buildBreakdown(items) : []),
		[items],
	);

	const query = search.trim().toLowerCase();
	const visibleRegions = useMemo(() => {
		if (!query) return breakdown;
		return breakdown
			.map((region) => {
				const rows = region.rows.filter((row) =>
					row.name.toLowerCase().includes(query),
				);
				return {
					...region,
					rows,
					value: rows.reduce((sum, row) => sum + row.value, 0),
					weekly: rows.reduce((sum, row) => sum + row.weekly, 0),
				};
			})
			.filter((region) => region.rows.length > 0);
	}, [breakdown, query]);

	const allRegionNames = breakdown.map((region) => region.region);
	const accordionValue = query
		? visibleRegions.map((region) => region.region)
		: (openRegions ?? allRegionNames);

	return (
		<>
			<Head>
				<title>Stardew Valley Money Tracker | stardew.app</title>
				<meta
					name="title"
					content="Stardew Valley Money Tracker | stardew.app"
				/>
				<meta
					name="description"
					content="Track your net worth in Stardew Valley. See the total value of your save — your gold plus everything your items would sell for, from chests and fridges to kegs and casks still in progress. Work towards the 10,000,000g Golden Clock and perfection."
				/>
				<meta
					name="og:description"
					content="Track your net worth in Stardew Valley. See the total value of your save — your gold plus everything your items would sell for, from chests and fridges to kegs and casks still in progress."
				/>
				<meta
					name="twitter:description"
					content="Track your net worth in Stardew Valley. See the total value of your save — your gold plus everything your items would sell for, from chests and fridges to kegs and casks still in progress."
				/>
				<meta
					name="keywords"
					content="stardew valley money tracker, stardew valley net worth, stardew valley gold, stardew valley golden clock, stardew valley perfection, stardew valley item values, stardew valley tracker, stardew valley, stardew"
				/>
			</Head>
			<main
				className={`flex min-h-screen border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<div className="mx-auto mt-4 w-full space-y-4">
					<Card className="flex w-full items-center justify-center">
						<div className="flex flex-col items-center px-6 py-8">
							<CardTitle className="mb-2 text-2xl font-semibold">
								Total Net Worth
							</CardTitle>
							{netWorth ? (
								<>
									<p className="text-4xl font-bold tabular-nums text-amber-500 dark:text-amber-400 sm:text-5xl">
										{gold(netWorth.total)}
									</p>
									<p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-600/90 dark:text-amber-500/90">
										<ArrowTrendingUpIcon className="h-4 w-4" />
										{gold(weeklyIncome)} / week estimated income
									</p>
								</>
							) : (
								<CardDescription className="mt-1 max-w-md text-center">
									{activePlayer
										? "Re-upload your save file to calculate your net worth — older uploads don't include item data yet."
										: "Upload a save file to see your net worth."}
								</CardDescription>
							)}
						</div>
					</Card>

					{netWorth && (
						<section className="space-y-3">
							<div className="flex items-center justify-between gap-4">
								<h2 className="ml-1 text-xl font-semibold text-gray-900 dark:text-white">
									Breakdown
								</h2>
								<Input
									type="search"
									placeholder="Search items..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="h-9 w-48 sm:w-64"
								/>
							</div>

							{!query && (
								<Card className="flex items-center justify-between px-5 py-4">
									<span className="text-sm font-semibold">Wallet</span>
									<span className="text-sm font-medium tabular-nums">
										{gold(netWorth.wallet)}
									</span>
								</Card>
							)}

							<Accordion
								type="multiple"
								value={accordionValue}
								onValueChange={setOpenRegions}
								className="space-y-3"
							>
								{visibleRegions.map((region) => (
									<AccordionItem
										key={region.region}
										value={region.region}
										className="rounded-lg border border-neutral-200 bg-white px-5 dark:border-neutral-800 dark:bg-neutral-950"
									>
										<AccordionTrigger className="py-4 hover:no-underline">
											<div className="flex w-full items-center justify-between gap-4 pr-2">
												<span className="font-semibold">{region.region}</span>
												<span className="flex items-baseline gap-3">
													<span className="text-sm font-medium tabular-nums">
														{gold(region.value)}
													</span>
													{region.weekly > 0 && (
														<span className="text-sm font-medium tabular-nums text-amber-600/90 dark:text-amber-500/90">
															+{gold(region.weekly)}/wk
														</span>
													)}
												</span>
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-x-4 border-b border-neutral-200 pb-2 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400 sm:grid-cols-[minmax(0,1fr)_9rem_6.5rem_6.5rem]">
												<span>Item</span>
												<span className="hidden sm:block">Location</span>
												<span className="text-right">Value</span>
												<span className="hidden text-right sm:block">
													Per week
												</span>
											</div>
											<div className="max-h-96 overflow-y-auto">
												{region.rows.map((row) => (
													<div
														key={`${row.name}|${row.location}`}
														className="grid grid-cols-[minmax(0,1fr)_6rem] items-baseline gap-x-4 border-b border-neutral-100 py-2 text-sm last:border-0 dark:border-neutral-900 sm:grid-cols-[minmax(0,1fr)_9rem_6.5rem_6.5rem]"
													>
														<span className="truncate">
															{row.name}
															{row.count > 1 && (
																<span className="ml-1.5 text-neutral-500 dark:text-neutral-400">
																	×{row.count.toLocaleString()}
																</span>
															)}
														</span>
														<span className="hidden truncate text-neutral-500 dark:text-neutral-400 sm:block">
															{row.location}
														</span>
														<span className="text-right tabular-nums">
															{row.value > 0 ? gold(row.value) : "—"}
														</span>
														<span className="hidden text-right tabular-nums text-amber-600/90 dark:text-amber-500/90 sm:block">
															{row.weekly > 0 ? `+${gold(row.weekly)}` : ""}
														</span>
													</div>
												))}
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>

							{query && visibleRegions.length === 0 && (
								<p className="ml-1 text-sm text-neutral-500 dark:text-neutral-400">
									Nothing matches &quot;{search}&quot;.
								</p>
							)}
						</section>
					)}
				</div>
			</main>
		</>
	);
}
