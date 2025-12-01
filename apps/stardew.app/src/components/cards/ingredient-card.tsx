import Image from "next/image";

import bigCraftables from "@/data/big_craftables.json";
import objects from "@/data/objects.json";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";

import { deweaponize } from "@/lib/utils";

import { NewItemBadge } from "@/components/new-item-badge";
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

import { IconChevronRight, IconExternalLink } from "@tabler/icons-react";

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
	 * Whether the user prefers to see new content
	 *
	 * @type {boolean}
	 * @memberof Props
	 */
	show: boolean;

	/**
	 * The handler to display the new content confirmation prompt
	 *
	 * @type {Dispatch<SetStateAction<boolean>>}
	 * @memberof Props
	 */
	setPromptOpen?: Dispatch<SetStateAction<boolean>>;
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
	show,
	setPromptOpen,
}: Props) => {
	const [open, setOpen] = useState(false);

	let item = GetItemDetails(itemID);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div
					className={cn(
						"relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-left text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50",
						"border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800",
					)}
					onClick={(e) => {
						if (item.minVersion === "1.6.0" && !show) {
							e.preventDefault();
							setPromptOpen?.(true);
							return;
						}
					}}
				>
					{item.minVersion === "1.6.0" && (
						<NewItemBadge version={item.minVersion} />
					)}
					<div
						className={cn(
							"flex items-center space-x-3 truncate text-left",
							item.minVersion === "1.6.0" && !show && "blur-sm",
						)}
					>
						<Image
							src={item.iconURL}
							alt={item.name}
							className="rounded-sm"
							width={32}
							height={32}
						/>
						<div className="min-w-0 flex-1 pr-3">
							<p className="truncate font-medium">{`${item.name} (${count}x)`}</p>
							<p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
								{item.description ?? ""}
							</p>
						</div>
					</div>
					<IconChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
				</div>
			</DialogTrigger>
			<DialogContent>
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
						<Button variant="secondary" onClick={() => setOpen(false)}>
							Close
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
