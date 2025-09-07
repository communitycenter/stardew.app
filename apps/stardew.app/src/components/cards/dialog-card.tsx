import type { Power } from "@/types/data";
import type { WalnutType } from "@/types/items";

import powers from "@/data/powers.json";
const powersData = powers as Record<string, Power>;

import walnut_data from "@/data/walnuts.json";
const walnutData = walnut_data as { [key: string]: WalnutType };

import Image from "next/image";

import { cn } from "@/lib/utils";

import { usePlayers } from "@/contexts/players-context";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

import { CreatePlayerRedirect } from "@/components/createPlayerRedirect";
import { NewItemBadge } from "@/components/new-item-badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { useMultiSelect } from "@/contexts/multi-select-context";
import { IslandUpgradeMail, Stardrop } from "@/lib/parsers/general";
import { ChevronRightIcon } from "@radix-ui/react-icons";

interface Props {
	title: string;
	description: string | ReactNode;
	iconURL: string;
	completed?: boolean;
	_id: string;
	_type:
		| "stardrop"
		| "note"
		| "scrap"
		| "walnut"
		| "power"
		| "rarecrow"
		| "island_upgrade";
	/**
	 * Whether the user prefers to see new content
	 *
	 * @type {boolean}
	 * @memberof Props
	 */
	show?: boolean;

	/**
	 * The handler to display the new content confirmation prompt
	 *
	 * @type {Dispatch<SetStateAction<boolean>>}
	 * @memberof Props
	 */
	setPromptOpen?: Dispatch<SetStateAction<boolean>>;
}

export const DialogCard = ({
	title,
	description,
	iconURL,
	completed,
	_id,
	_type,
	show,
	setPromptOpen,
}: Props) => {
	const { activePlayer, patchPlayer } = usePlayers();
	const [open, setOpen] = useState(false);
	const { isMultiSelectMode, selectedItems, toggleItem } = useMultiSelect();

	const minVersion = _type === "power" ? powersData[_id].minVersion : "1.5.0";

	let checkedClass = completed
		? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
		: "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

	if (isMultiSelectMode && selectedItems.has(_id)) {
		checkedClass += " ring-2 ring-primary";
	}

	async function handleStatusChange(status: boolean) {
		if (!activePlayer) return;

		let patch = {};
		switch (_type) {
			case "stardrop":
				const stardrops = new Set(activePlayer.general?.stardrops ?? []);
				if (status) stardrops.add(_id as Stardrop);
				else stardrops.delete(_id as Stardrop);

				patch = {
					general: {
						stardrops: Array.from(stardrops),
					},
				};
				break;

			case "note":
				const notes = new Set(activePlayer.notes?.found ?? []);
				if (status) notes.add(parseInt(_id));
				else notes.delete(parseInt(_id));

				patch = {
					notes: {
						found: Array.from(notes),
					},
				};
				break;

			case "scrap":
				const scraps = new Set(activePlayer.scraps?.found ?? []);
				if (status) scraps.add(parseInt(_id));
				else scraps.delete(parseInt(_id));

				patch = {
					scraps: {
						found: Array.from(scraps),
					},
				};
				break;

			case "walnut":
				const walnuts = activePlayer.walnuts?.found ?? {};
				if (status) walnuts[_id] = walnutData[_id].count;
				else walnuts[_id] = 0;

				patch = {
					walnuts: {
						found: walnuts,
					},
				};
				break;

			case "power":
				let powers = new Set(activePlayer?.powers?.collection ?? []);

				if (status) powers.add(_id);
				else powers.delete(_id);

				patch = {
					powers: {
						collection: Array.from(powers),
					},
				};
				break;

			case "island_upgrade":
				const islandUpgrades = new Set(
					activePlayer.general?.islandUpgrades ?? [],
				);
				if (status) islandUpgrades.add(_id as IslandUpgradeMail);
				else islandUpgrades.delete(_id as IslandUpgradeMail);

				patch = {
					general: {
						islandUpgrades: Array.from(islandUpgrades),
					},
				};
				break;

			case "rarecrow":
				const rarecrows = new Set(activePlayer.rarecrows || []);
				if (status) rarecrows.add(_id);
				else rarecrows.delete(_id);

				patch = { rarecrows: Array.from(rarecrows) };
				break;
		}

		if (Object.keys(patch).length === 0) return;

		await patchPlayer(patch);
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div
				className={cn(
					"relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50",
					checkedClass,
				)}
				onClick={(e) => {
					if (isMultiSelectMode) {
						toggleItem(_id);
						return;
					}
					if (minVersion === "1.6.0" && !show && !completed) {
						e.preventDefault();
						setPromptOpen?.(true);
						return;
					}
					setOpen(true);
				}}
			>
				{minVersion === "1.6.0" && <NewItemBadge version={minVersion} />}
				<div
					className={cn(
						"flex items-center space-x-3 truncate text-left",
						minVersion === "1.6.0" && !show && !completed && "blur-sm",
					)}
				>
					<Image src={iconURL} alt={title} width={32} height={32} />
					<p>{title}</p>
				</div>
				<ChevronRightIcon className="h-5 w-5" />
			</div>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription className="whitespace-pre-wrap">
					{description}
				</DialogDescription>
				<DialogFooter className="gap-4 sm:gap-0">
					{completed ? (
						<Button
							variant="secondary"
							disabled={!activePlayer || !completed}
							data-umami-event="Set incompleted"
							onClick={() => {
								handleStatusChange(false);
							}}
						>
							Set Incomplete
						</Button>
					) : (
						<Button
							variant="secondary"
							disabled={!activePlayer || completed}
							data-umami-event="Set completed"
							onClick={() => {
								handleStatusChange(true);
							}}
						>
							Set Completed
						</Button>
					)}
				</DialogFooter>
				{!activePlayer && <CreatePlayerRedirect />}
			</DialogContent>
		</Dialog>
	);
};
