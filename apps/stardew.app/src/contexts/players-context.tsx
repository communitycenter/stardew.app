import useSWR from "swr";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type { CookingRet, CraftingRet, FishRet, GeneralRet, MonstersRet, MuseumRet, NotesRet, PerfectionRet, PowersRet, ScrapsRet, ShippingRet, SocialRet, WalnutRet } from '@communitycenter/stardew-save-parser'
import type { BundleWithStatus } from "@/types/bundles";
import type { DeepPartial } from "react-hook-form";

export interface PlayerType {
	_id: string;
	general?: GeneralRet;
	bundles?: BundleWithStatus[];
	fishing?: FishRet;
	cooking?: CookingRet;
	crafting?: CraftingRet;
	shipping?: ShippingRet;
	museum?: MuseumRet;
	social?: SocialRet;
	monsters?: MonstersRet;
	walnuts?: WalnutRet;
	notes?: NotesRet;
	scraps?: ScrapsRet;
	perfection?: PerfectionRet;
	powers?: PowersRet;
}

interface PlayersContextProps {
	players?: PlayerType[];
	uploadPlayers: (players: PlayerType[]) => Promise<Response>;
	patchPlayer: (patch: DeepPartial<PlayerType>) => Promise<void>;
	activePlayer?: PlayerType;
	setActivePlayer: (player?: PlayerType) => void;
}

export const PlayersContext = createContext<PlayersContextProps>({
	// @ts-expect-error - default values replaced in PlayersProvider
	uploadPlayers: () => {},
	patchPlayer: () => Promise.resolve(),
	setActivePlayer: () => {},
});

/**
 * Normalizes a patch object against a target object to ensure all nested objects and arrays will persist to the DB correctly.
 * This function ensures anything in or under an array is included in the patch because json_merge_patch does not recurse into arrays.
 * @param patch The changes to apply to the target.
 * @param target The original object that the patch will modify.
 * @param inArray A flag indicating if the current process is within an array.
 * @returns A new object representing the merged state of patch and target.
 */
function normalizePatch(
	patch: any,
	target: any,
	inArray: boolean = false,
): any {
	// Return the patch immediately if there's no target to merge with.
	if (!target) {
		return patch;
	}

	// Return the patch directly if it's not an object or array.
	if (typeof patch !== "object" || patch === null) {
		return patch;
	}

	// Initialize a new patch that copies the original to avoid mutations.
	let newPatch: any;
	if (inArray) {
		newPatch = Array.isArray(target) ? [...target] : { ...target };
	} else {
		newPatch = Array.isArray(patch) ? [...patch] : { ...patch };
	}

	// Iterate over all properties in the patch object.
	for (const key in patch) {
		if (Array.isArray(target[key])) {
			// Handle array merging by first copying the existing target array.
			newPatch[key] = [...target[key]];

			// Recursively normalize each element of the array.
			if (
				patch[key] &&
				typeof patch[key] === "object" &&
				!Array.isArray(patch[key]) &&
				Object.keys(patch[key]).every((input: any) => {
					if (typeof input === "number") {
						return Number.isInteger(input);
					} else if (typeof input === "string") {
						const num = Number(input);
						return Number.isInteger(num) && input.trim() === num.toString();
					}
					return false;
				})
			) {
				for (const arrIndex in patch[key]) {
					newPatch[key][arrIndex] = normalizePatch(
						patch[key][arrIndex],
						// @ts-expect-error not sure what this is
						target[key][arrIndex],
						true,
					);
				}
			} else {
				// If the patch is a non-object, replace the target array with the patch.
				newPatch[key] = patch[key];
			}
		} else {
			// Recursively normalize nested objects.
			newPatch[key] = normalizePatch(patch[key], target[key], inArray);
		}
	}

	// If we are in an array, ensure that missing fields in the patch are filled from the target.
	if (inArray) {
		Object.keys(target).forEach((field) => {
			if (!(field in newPatch)) {
				newPatch[field] = target[field];
			}
		});
	}

	return newPatch;
}

/**
 * Recursively merges properties from source objects into a target object, creating a new object.
 * This function does not mutate the original target but returns a new object.
 * It only updates references within the new object when there are actual changes to content or children,
 * regardless of the depth of those changes. Arrays are copied rather than merged, and nested objects
 * are recursively populated. This function can handle an arbitrary number of source objects.
 * @param target The initial object to merge properties into.
 * @param sources One or more objects from which properties will be sourced.
 * @returns The target object merged with properties from all source objects.
 */
export function mergeDeep(target: any, ...sources: any[]): any {
	const isObject = (item: any) => item && typeof item === "object";

	if (!sources.length) return target;
	const source = sources.shift();
	const newTarget = Array.isArray(target) ? [...target] : { ...target };

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (Array.isArray(source[key])) {
				newTarget[key] = source[key];
			} else if (isObject(source[key])) {
				if (!target[key]) {
					newTarget[key] = Array.isArray(source[key]) ? [] : {};
				}
				newTarget[key] = mergeDeep(newTarget[key], source[key]);
			} else {
				newTarget[key] = source[key];
			}
		}
	}
	return mergeDeep(newTarget, ...sources);
}

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
	const api = useSWR<PlayerType[]>("/api/saves", (...args: any[]) =>
		// @ts-expect-error
		fetch(...args).then((res) => res.json()),
	);
	const [activePlayerId, setActivePlayerId] = useState<string>();
	const players = useMemo(() => api.data ?? [], [api.data]);
	const activePlayer = useMemo(
		() => players.find((p) => p._id === activePlayerId),
		[players, activePlayerId],
	);

	useEffect(() => {
		if (!activePlayerId && players.length > 0) {
			// first lets check if local storage contains the last set player
			if (typeof window !== "undefined") {
				const stored = window.localStorage.getItem("player_id");

				// also check if the player_id is still in the players array
				if (stored && players.some((player) => player._id === stored)) {
					setActivePlayerId(stored);
				} else setActivePlayerId(players[0]._id);
			}
		}
	}, [activePlayerId, players]);

	// TODO: switch patchplayer use immutability-helper instead of custom merge logic
	const patchPlayer = useCallback(
		async (patch: DeepPartial<PlayerType>) => {
			if (!activePlayer) return;
			const patchPlayers = (players: PlayerType[] | undefined) =>
				(players ?? []).map((p) => {
					if (p._id === activePlayer._id) {
						return mergeDeep(p, patch);
					}
					return p;
				});
			await api.mutate(
				async (currentPlayers: PlayerType[] | undefined) => {
					const normalizedPatch = normalizePatch(patch, activePlayer);
					if (!normalizedPatch.bundles) {
						// By default if bundles are not in the patch, the server will use an empty array,
						// which will clobber the existing bundle data since mysql doesn't support arrays properly.
						normalizedPatch.bundles = activePlayer.bundles;
					}
					// console.log("Normalizing patch:");
					// console.dir(normalizedPatch);
					await fetch(`/api/saves/${activePlayer._id}`, {
						method: "PATCH",
						body: JSON.stringify(normalizedPatch),
					});
					return patchPlayers(currentPlayers);
				},
				{ optimisticData: patchPlayers },
			);
		},
		[api],
	);

	const uploadPlayers = useCallback(
		async (players: PlayerType[]) => {
			let res = await fetch("/api/saves", {
				method: "POST",
				body: JSON.stringify(players),
			});
			await api.mutate(players);
			setActivePlayerId(players[0]._id);
			return res;
		},
		[api, setActivePlayerId],
	);

	const setActivePlayer = useCallback((player?: PlayerType) => {
		if (!player) {
			setActivePlayerId(undefined);
			return;
		}

		setActivePlayerId(player._id);

		if (typeof window !== "undefined") {
			// console.log(`Setting player_id to '${player._id}'`);
			window.localStorage.setItem("player_id", player._id);
		}
	}, []);

	return (
		<PlayersContext.Provider
			value={{
				players,
				uploadPlayers,
				patchPlayer,
				activePlayer,
				setActivePlayer,
			}}
		>
			{children}
		</PlayersContext.Provider>
	);
};

export const usePlayers = () => {
	return useContext(PlayersContext);
};
