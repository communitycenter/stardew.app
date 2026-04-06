import type { PlayerType } from "@/contexts/players-context";
import { useRouter } from "next/router";

import { cn } from "@/lib/utils";
import { useContext, useMemo, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	CaretSortIcon,
	CheckIcon,
	MagnifyingGlassIcon,
	PlusIcon,
} from "@radix-ui/react-icons";

export function PresetSelector() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const { players, activePlayer, setActivePlayer } = useContext(PlayersContext);

	const groupedPlayers = useMemo(() => {
		const farms = new Map<string, PlayerType[]>();

		for (const player of players ?? []) {
			const farmInfo = player.general?.farmInfo ?? "Unknown Farm";
			const existingPlayers = farms.get(farmInfo) ?? [];
			existingPlayers.push(player);
			farms.set(farmInfo, existingPlayers);
		}

		return Array.from(farms.entries());
	}, [players]);

	const filteredGroupedPlayers = useMemo(() => {
		if (!search) return groupedPlayers;
		const lower = search.toLowerCase();
		return groupedPlayers
			.map(
				([farmInfo, farmPlayers]) =>
					[
						farmInfo,
						farmPlayers.filter((p) =>
							(p.general?.name ?? "").toLowerCase().includes(lower),
						),
					] as [string, PlayerType[]],
			)
			.filter(([, farmPlayers]) => farmPlayers.length > 0);
	}, [groupedPlayers, search]);

	return (
		<DropdownMenu
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) setSearch("");
			}}
			modal={false}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-label="Load a farmhand..."
					aria-expanded={open}
					className="flex-1 justify-between md:max-w-[200px]"
				>
					<p className="w-full max-w-full truncate text-left">
						{activePlayer?.general?.name ?? "Load a farmhand..."}
					</p>
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[200px] p-0" align="start">
				<div
					className="flex items-center border-b px-3 dark:border-neutral-800"
					onPointerDown={(e) => e.stopPropagation()}
				>
					<MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
					<input
						placeholder="Search farmhands..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyDown={(e) => e.stopPropagation()}
						className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
					{filteredGroupedPlayers.length === 0 && (
						<p className="py-6 text-center text-sm text-neutral-500">
							No farmhands found.
						</p>
					)}
					{filteredGroupedPlayers.map(([farmInfo, farmPlayers]) => (
						<DropdownMenuGroup key={farmInfo}>
							<DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
								{farmInfo.split(" (")[0]}
							</DropdownMenuLabel>
							{farmPlayers.map((player: PlayerType) => (
								<DropdownMenuItem
									key={player._id}
									onSelect={() => {
										setActivePlayer(player);
										setOpen(false);
									}}
								>
									<p className="w-full max-w-full truncate">
										{player.general?.name ?? "Unnamed Farmhand"}
									</p>
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											activePlayer?._id === player._id
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onSelect={() => {
							setOpen(false);
							void router.push("/editor/create");
						}}
					>
						<PlusIcon className="mr-2 h-4 w-4" />
						New Farmhand
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
