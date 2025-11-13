import shipping_items from "@/data/shipping.json";

import type { Recipe } from "@/types/recipe";

import { usePlayers } from "@/contexts/players-context";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { IngredientCard, IngredientMinVersion } from "./cards/ingredient-card";

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

class IngredientData {
	counts: [number, number, number] = [0, 0, 0];
	seasons: string[] = [];

	constructor(itemID: string) {
		if (itemID in shipping_items) {
			this.seasons =
				shipping_items[itemID as keyof typeof shipping_items].seasons;
		}
	}
}

type IngredientsRecord = Record<string, IngredientData>;

export const IngredientList = <T extends Recipe>({
	recipes,
	playerRecipes,
	filterKnown = "",
	filterSeason = "all",
	setPromptOpen,
	show,
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

	const ingredientCounts: IngredientsRecord = useMemo(() => {
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

				if (i.itemID in recipes) {
					a = reduceIngredients(a, [i.itemID, recipes[i.itemID]], status);
				}

				return a;
			}, acc);

		return Object.entries(recipes).reduce(
			(acc, [id, v]) =>
				reduceIngredients(acc, [id, v], playerRecipes[v.itemID] ?? 0),
			{},
		);
	}, [recipes, playerRecipes]);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
			{Object.entries(ingredientCounts)
				.filter(([id, _]) => semverGte(gameVersion, IngredientMinVersion(id)))
				.filter(([_, details]) => {
					if (filterSeason === "all") {
						return true;
					}

					return (
						details.seasons.length == 0 ||
						details.seasons.includes(filterSeason)
					);
				})
				.map(([id, details]): [string, number] => {
					switch (filterKnown) {
						case "0":
							return [id, details.counts[0]];
						case "1":
							return [id, details.counts[1]];
						case "2":
							return [id, 0];
						default:
							return [id, details.counts[0] + details.counts[1]];
					}
				})
				.filter(([_, count]) => count > 0)
				.map(([id, count]) => (
					<IngredientCard
						key={id}
						itemID={id}
						count={count}
						show={show}
						setPromptOpen={setPromptOpen}
					/>
				))}
		</div>
	);
};
