import Image from "next/image";

import bigCraftables from "@/data/big_craftables.json";
import objects from "@/data/objects.json";

import type { CraftingRecipe, Recipe } from "@/types/recipe";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useRef } from "react";

import { useMultiSelect } from "@/contexts/multi-select-context";
import { usePlayers } from "@/contexts/players-context";

import { NewItemBadge } from "@/components/new-item-badge";
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { IconChevronRight } from "@tabler/icons-react";

interface Props<T extends Recipe> {
	recipe: T;
	status: number;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	setObject: Dispatch<SetStateAction<T | null>>;

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

	index: number;
	allRecipes: T[];
}

export const RecipeCard = <T extends Recipe>({
	recipe,
	status,
	setIsOpen,
	setObject,
	setPromptOpen,
	show,
	index,
	allRecipes,
}: Props<T>) => {
	const { activePlayer, patchPlayer } = usePlayers();
	const { isMultiSelectMode, selectedItems, toggleItem, addItems } =
		useMultiSelect();
	const lastSelectedIndex = useRef<number | null>(null);

	let colorClass = "";
	switch (status) {
		case 1:
			colorClass =
				"border-yellow-900 bg-yellow-500/20 hover:bg-yellow-500/30 dark:bg-yellow-500/10 hover:dark:bg-yellow-500/20";
			break;
		case 2:
			colorClass =
				"border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20";
			break;
		default:
			colorClass =
				"border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";
			break;
	}

	// accepts any type that extends Recipe (CraftingRecipe, CookingRecipe, etc.)
	// returns true if the recipe is of type U and CraftingRecipe which for now
	// is just the type CraftingRecipes
	function isCraftingRecipe<U extends Recipe>(
		recipe: U,
	): recipe is U & CraftingRecipe {
		return "isBigCraftable" in recipe;
	}

	const iconURL =
		isCraftingRecipe(recipe) && recipe.isBigCraftable
			? `https://cdn.stardew.app/images/(BC)${recipe.itemID}.webp`
			: `https://cdn.stardew.app/images/(O)${recipe.itemID}.webp`;

	const name = isCraftingRecipe(recipe)
		? recipe.isBigCraftable
			? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
					.name
			: objects[recipe.itemID.toString() as keyof typeof objects].name
		: objects[recipe.itemID.toString() as keyof typeof objects].name;

	const description = isCraftingRecipe(recipe)
		? recipe.isBigCraftable
			? bigCraftables[recipe.itemID.toString() as keyof typeof bigCraftables]
					.description
			: objects[recipe.itemID.toString() as keyof typeof objects].description
		: objects[recipe.itemID.toString() as keyof typeof objects].description;

	async function handleStatusChange(newStatus: number | null) {
		if (!activePlayer) return;

		const patch = {
			[isCraftingRecipe(recipe) ? "crafting" : "cooking"]: {
				recipes: {
					[recipe.itemID]: newStatus,
				},
			},
		};

		await patchPlayer(patch);
	}

	const isSelected = selectedItems.has(recipe.itemID.toString());

	const handleClick = (e: React.MouseEvent) => {
		if (isMultiSelectMode) {
			if (e.shiftKey && lastSelectedIndex.current !== null) {
				// Select range of items
				const start = Math.min(lastSelectedIndex.current, index);
				const end = Math.max(lastSelectedIndex.current, index);
				const itemsToSelect = allRecipes
					.slice(start, end + 1)
					.map((r) => r.itemID.toString());
				addItems(itemsToSelect);
			} else {
				// Single item selection
				toggleItem(recipe.itemID.toString());
				lastSelectedIndex.current = index;
			}
			return;
		}

		if (recipe.minVersion === "1.6.0" && !show && status < 1) {
			setPromptOpen?.(true);
			return;
		}
		setObject(recipe);
		setIsOpen(true);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<button
					className={cn(
						"relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50",
						colorClass,
						isMultiSelectMode && isSelected && "ring-2 ring-blue-500",
					)}
					onClick={handleClick}
				>
					{recipe.minVersion === "1.6.0" && (
						<NewItemBadge version={recipe.minVersion} />
					)}
					<div
						className={cn(
							"flex items-center space-x-3 truncate text-left",
							recipe.minVersion === "1.6.0" && !show && status < 1 && "blur-sm",
						)}
					>
						<Image
							src={iconURL}
							alt={name}
							className="rounded-sm"
							width={
								isCraftingRecipe(recipe) && recipe.isBigCraftable ? 16 : 32
							}
							height={32}
						/>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium">{name}</p>
							<p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
								{description}
							</p>
						</div>
					</div>
					{!isMultiSelectMode && (
						<IconChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
					)}
				</button>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-48">
				<ContextMenuCheckboxItem
					className="gap-2 pl-8"
					checked={status === 0}
					disabled={status === 0 || !activePlayer}
					onClick={() => {
						handleStatusChange(null);
					}}
				>
					<div className="h-4 w-4 rounded-full border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950" />
					<p>Set Unknown</p>
				</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem
					className="gap-2 pl-8"
					checked={status === 1}
					disabled={status === 1 || !activePlayer}
					onClick={() => {
						handleStatusChange(1);
					}}
				>
					<div className="h-4 w-4 rounded-full border border-yellow-900 bg-yellow-500/20 dark:bg-yellow-500/10" />
					Set Known
				</ContextMenuCheckboxItem>
				<ContextMenuCheckboxItem
					className="gap-2 pl-8"
					checked={status === 2}
					disabled={status === 2 || !activePlayer}
					onClick={() => {
						handleStatusChange(2);
					}}
				>
					<div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20 dark:bg-green-500/10" />
					Set Completed
				</ContextMenuCheckboxItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
