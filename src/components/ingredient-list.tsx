import bigCraftables from "@/data/big_craftables.json";
import fishes from "@/data/fish.json";
import objects from "@/data/objects.json";
import shipping_items from "@/data/shipping.json";

import type { Recipe } from "@/types/recipe";

import { usePlayers } from "@/contexts/players-context";
import { useEffect, useMemo, useState } from "react";

import {
	IngredientCard,
	IngredientMinVersion,
	IngredientName,
	type RecipeUsage,
} from "./cards/ingredient-card";

const semverGte = require("semver/functions/gte");

interface Props<T extends Recipe> {
	/**
	 * All of the recipes available within the game
	 */
	recipes: {
		[key: string]: T;
	};

	/**
	 * Player's recipe knowledge
	 */
	playerRecipes: {
		[key: string]: 0 | 1 | 2;
	};

	/**
	 * Whether to limit ingredients counts to unkown ("0"), known ("1"), or
	 * "all" recipes.
	 */
	filterKnown?: string;

	/**
	 * Limit shown ingredients to those available in a particular season, or
	 * "all" ingredients.
	 */
	filterSeason?: string;

	/**
	 * Allow for searching for specific ingredients.
	 */
	searchText?: string;

	/**
	 * Hide ingredients the player already owns enough of. Only applies when
	 * the uploaded save includes inventory data.
	 */
	onlyMissing?: boolean;
}

function RecipeName(recipe: Recipe): string {
	if ("isBigCraftable" in recipe && recipe.isBigCraftable) {
		return (
			bigCraftables[recipe.itemID as keyof typeof bigCraftables]?.name ??
			recipe.itemID
		);
	}

	return objects[recipe.itemID as keyof typeof objects]?.name ?? recipe.itemID;
}

class IngredientData {
	id: string = "";
	counts: [number, number, number] = [0, 0, 0];
	usedIn: RecipeUsage[] = [];
	seasons: string[] = [];

	constructor(itemID: string) {
		this.id = itemID;

		if (itemID in fishes) {
			const f = fishes[itemID as keyof typeof fishes];

			if ("seasons" in f) {
				this.seasons = f.seasons;
			}
		} else if (itemID in shipping_items) {
			this.seasons =
				shipping_items[itemID as keyof typeof shipping_items].seasons;
		}
	}
}

type IngredientsRecord = Record<string, IngredientData>;

export const IngredientList = <T extends Recipe>({
	recipes,
	playerRecipes,
	filterKnown,
	filterSeason = "all",
	searchText,
	onlyMissing = false,
}: Props<T>) => {
	const [gameVersion, setGameVersion] = useState("1.6.0");

	const { activePlayer } = usePlayers();

	useEffect(() => {
		if (activePlayer) {
			// set the minimum game version
			if (activePlayer.general?.gameVersion) {
				const version = activePlayer.general.gameVersion;
				setGameVersion(version);
			}
		}
	}, [activePlayer]);

	const ingredientCounts: IngredientData[] = useMemo(() => {
		const reduceIngredients = (
			acc: IngredientsRecord,
			[_, v]: [string, T],
			status: 0 | 1 | 2,
		): IngredientsRecord =>
			v.ingredients.reduce((a, i) => {
				if (!(i.itemID in a)) {
					a[i.itemID] = new IngredientData(i.itemID);
				}

				a[i.itemID].counts[status] += i.quantity;

				if (status !== 2) {
					a[i.itemID].usedIn.push({
						name: RecipeName(v),
						quantity: i.quantity,
						status,
					});
				}

				if (i.itemID in recipes) {
					a = reduceIngredients(a, [i.itemID, recipes[i.itemID]], status);
				}

				return a;
			}, acc);

		const ingredientsMap: IngredientsRecord = Object.entries(recipes).reduce(
			(acc, [id, v]) =>
				reduceIngredients(acc, [id, v], playerRecipes[v.itemID] ?? 0),
			{},
		);

		return Object.values(ingredientsMap).sort((a, b) => {
			const a_name = IngredientName(a.id);
			const b_name = IngredientName(b.id);

			if (a_name === b_name) {
				return 0;
			}

			return a_name < b_name ? -1 : 1;
		});
	}, [recipes, playerRecipes]);

	const inventory = activePlayer?.general?.inventory;
	const currentSeason = activePlayer?.general?.date?.season;

	const cards = ingredientCounts
		.filter((details) =>
			semverGte(gameVersion, IngredientMinVersion(details.id)),
		)
		.filter((details) => {
			if (!searchText) {
				return true;
			}

			return IngredientName(details.id)
				.toLowerCase()
				.includes(searchText.toLowerCase());
		})
		.filter((details) => {
			if (filterSeason === "all") {
				return true;
			}

			return (
				details.seasons.length == 0 || details.seasons.includes(filterSeason)
			);
		})
		.map((details) => {
			let count: number;
			let usedIn: RecipeUsage[];
			switch (filterKnown) {
				case "0":
				case "1":
					count = details.counts[filterKnown === "0" ? 0 : 1];
					usedIn = details.usedIn.filter(
						(u) => u.status === Number(filterKnown),
					);
					break;
				case "2":
					count = 0;
					usedIn = [];
					break;
				default:
					count = details.counts[0] + details.counts[1];
					usedIn = details.usedIn;
			}

			const have = inventory ? (inventory[details.id] ?? 0) : undefined;
			const short = have === undefined ? count : Math.max(count - have, 0);

			// Ingredients without season data (minerals, artisan goods, ...) can
			// be gathered any time, so they don't get a season badge.
			const inSeason =
				currentSeason && details.seasons.length > 0
					? details.seasons.some((s) => s.toLowerCase() === currentSeason)
					: undefined;

			return { id: details.id, count, have, short, usedIn, inSeason };
		})
		.filter(({ count }) => count > 0)
		.filter(({ short }) => !onlyMissing || short > 0)
		// with inventory data, show what the player still needs first
		.sort((a, b) => Number(a.short === 0) - Number(b.short === 0));

	if (cards.length === 0) {
		return (
			<p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
				{onlyMissing
					? "You have every ingredient you need for these recipes."
					: "No ingredients match these filters."}
			</p>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
			{cards.map(({ id, count, have, usedIn, inSeason }) => (
				<IngredientCard
					key={id}
					itemID={id}
					count={count}
					have={have}
					usedIn={usedIn}
					inSeason={inSeason}
				/>
			))}
		</div>
	);
};
