import Image from "next/image";

import objects from "@/data/objects.json";

import type { FishType } from "@/types/items";

import { Dispatch, SetStateAction, useContext, useMemo } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMultiSelect } from "@/contexts/multi-select-context";
import { useMediaQuery } from "@react-hook/media-query";
import { IconExternalLink } from "@tabler/icons-react";
import { CreatePlayerRedirect } from "../createPlayerRedirect";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "../ui/sheet";

interface Props {
	open: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	fish: FishType | null;
	showCaught?: boolean;
}

export const FishSheet = ({
	open,
	setIsOpen,
	fish,
	showCaught = true,
}: Props) => {
	const { activePlayer, patchPlayer } = useContext(PlayersContext);
	const { selectedItems, clearSelection } = useMultiSelect();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const fishCaught = useMemo(() => {
		if (
			!activePlayer ||
			!activePlayer.fishing ||
			!activePlayer.fishing.fishCaught
		)
			return new Set([]);

		return new Set(activePlayer.fishing.fishCaught);
	}, [activePlayer]);

	const iconURL =
		fish && `https://cdn.stardew.app/images/(O)${fish.itemID}.webp`;

	const name =
		fish && objects[fish.itemID.toString() as keyof typeof objects].name;

	const description =
		fish && objects[fish.itemID.toString() as keyof typeof objects].description;

	async function handleStatusChange(status: number) {
		if (!activePlayer || !fish) return;

		if (status === 2) fishCaught.add(fish.itemID.toString());
		if (status === 0) fishCaught.delete(fish.itemID.toString());

		const patch = {
			fishing: {
				fishCaught: Array.from(fishCaught),
			},
		};

		await patchPlayer(patch);
		setIsOpen(false);
	}

	async function handleBulkStatusChange(status: number) {
		if (!activePlayer || selectedItems.size === 0) return;

		const newFishCaught = new Set(fishCaught);
		selectedItems.forEach((itemId) => {
			if (status === 2) newFishCaught.add(itemId.toString());
			if (status === 0) newFishCaught.delete(itemId.toString());
		});

		const patch = {
			fishing: {
				fishCaught: Array.from(newFishCaught),
			},
		};

		await patchPlayer(patch);
		clearSelection();
		setIsOpen(false);
	}

	const content = (
		<>
			<div className="mt-4 space-y-6">
				<section className="space-y-2">
					<div className="grid grid-cols-1 gap-2">
						{showCaught &&
							(selectedItems.size > 0 ? (
								<>
									<Button
										variant="secondary"
										data-umami-event="Bulk set completed"
										onClick={() => handleBulkStatusChange(2)}
									>
										Set All Selected as Caught
									</Button>
									<Button
										variant="secondary"
										data-umami-event="Bulk set incompleted"
										onClick={() => handleBulkStatusChange(0)}
									>
										Set All Selected as Uncaught
									</Button>
								</>
							) : (
								<>
									{fishCaught.has(fish?.itemID?.toString() ?? "0") ? (
										<Button
											variant="secondary"
											disabled={
												!activePlayer ||
												!fishCaught.has(fish?.itemID?.toString() ?? "0")
											}
											data-umami-event="Set incompleted"
											onClick={() => {
												handleStatusChange(0);
											}}
										>
											Set Uncaught
										</Button>
									) : (
										<Button
											variant="secondary"
											disabled={
												!activePlayer ||
												fishCaught.has(fish?.itemID?.toString() ?? "0")
											}
											data-umami-event="Set completed"
											onClick={() => {
												handleStatusChange(2);
											}}
										>
											Set Caught
										</Button>
									)}
								</>
							))}
						{showCaught && !activePlayer && <CreatePlayerRedirect />}
						{name && (
							<Button variant="outline" data-umami-event="Visit wiki" asChild>
								<a
									className="flex items-center"
									target="_blank"
									rel="noreferrer"
									href={`https://stardewvalleywiki.com/${name.replaceAll(
										" ",
										"_",
									)}`}
								>
									Visit Wiki Page
									<IconExternalLink className="h-4"></IconExternalLink>
								</a>
							</Button>
						)}
					</div>
				</section>
				{fish && (
					<>
						<section className="space-y-2">
							<h3 className="font-semibold">Location</h3>
							<Separator />
							<ul className="list-inside list-disc">
								{fish.locations.map((location) => (
									<li
										key={location}
										className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
									>
										{location}
									</li>
								))}
							</ul>
						</section>
						{!fish.trapFish && (
							<>
								<section className="space-y-2">
									<h3 className="font-semibold">Season</h3>
									<Separator />
									<ul className="list-inside list-disc">
										{fish.seasons.map((season) => (
											<li
												key={season}
												className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
											>
												{season}
											</li>
										))}
									</ul>
								</section>
								<section className="space-y-2">
									<h3 className="font-semibold">Time</h3>
									<Separator />
									<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
										{fish.time}
									</p>
								</section>
								<section className="space-y-2">
									<h3 className="font-semibold">Weather</h3>
									<Separator />
									<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
										{fish.weather}
									</p>
								</section>
								<section className="space-y-2">
									<h3 className="font-semibold">Difficulty</h3>
									<Separator />
									<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
										{fish.difficulty}
									</p>
								</section>
							</>
						)}
					</>
				)}
			</div>
		</>
	);

	if (isDesktop) {
		return (
			<Sheet open={open} onOpenChange={setIsOpen}>
				<SheetContent>
					<SheetHeader className="mt-4">
						<div className="flex justify-center">
							<Image
								src={iconURL ? iconURL : ""}
								alt={name ? name : "No Info"}
								height={64}
								width={64}
							/>
						</div>
						<SheetTitle className="text-center">
							{name ? name : "No Info"}
						</SheetTitle>
						<SheetDescription className="text-center italic">
							{description ? description : "No Description Found"}
						</SheetDescription>
					</SheetHeader>
					{content}
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setIsOpen}>
			<DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[90dvh]">
				<ScrollArea className="overflow-auto">
					<DrawerHeader className="-mb-4 mt-4">
						<div className="flex justify-center">
							<Image
								src={iconURL ? iconURL : ""}
								alt={name ? name : "No Info"}
								height={64}
								width={64}
							/>
						</div>
						<DrawerTitle className="text-center">
							{name ? name : "No Info"}
						</DrawerTitle>
						<DrawerDescription className="text-center italic">
							{description ? description : "No Description Found"}
						</DrawerDescription>
					</DrawerHeader>
					<div className="space-y-6 p-6">{content}</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
};
