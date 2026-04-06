import useSWR from "swr";

import {
	createContext,
	ReactNode,
	startTransition,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useOptimistic,
	useRef,
	useState,
} from "react";

import type { CookingRet } from "@/lib/parsers/cooking";
import type { CraftingRet } from "@/lib/parsers/crafting";
import type { FishRet } from "@/lib/parsers/fishing";
import type { GeneralRet } from "@/lib/parsers/general";
import type { MonstersRet } from "@/lib/parsers/monsters";
import type { MuseumRet } from "@/lib/parsers/museum";
import type { NotesRet } from "@/lib/parsers/notes";
import type { PerfectionRet } from "@/lib/parsers/perfection";
import type { PowersRet } from "@/lib/parsers/powers";
import type { RarecrowRet } from "@/lib/parsers/rarecrows";
import type { ScrapsRet } from "@/lib/parsers/scraps";
import type { ShippingRet } from "@/lib/parsers/shipping";
import type { SocialRet } from "@/lib/parsers/social";
import type { WalnutRet } from "@/lib/parsers/walnuts";
import type { BundleWithStatus } from "@/types/bundles";
import type { AnimalsData } from "@/types/data";
import { fetchJson } from "@/lib/fetch";
import { applyPlayerPatch } from "@/lib/player-patch";
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
	rarecrows?: RarecrowRet;
	animals?: AnimalsData;
}

interface PlayersContextProps {
	players?: PlayerType[];
	uploadPlayers: (players: PlayerType[]) => Promise<PlayerType[]>;
	deletePlayers: (playerId?: string) => Promise<PlayerType[]>;
	patchPlayer: (patch: DeepPartial<PlayerType>) => Promise<void>;
	activePlayer?: PlayerType;
	setActivePlayer: (player?: PlayerType) => void;
}

export const PlayersContext = createContext<PlayersContextProps>({
	uploadPlayers: () => Promise.resolve([]),
	deletePlayers: () => Promise.resolve([]),
	patchPlayer: () => Promise.resolve(),
	setActivePlayer: () => {},
});

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
	const api = useSWR<PlayerType[]>("/api/saves", fetchJson<PlayerType[]>);
	const [activePlayerId, setActivePlayerId] = useState<string>();
	const patchQueue = useRef(Promise.resolve());
	const players = useMemo(() => api.data ?? [], [api.data]);

	const [optimisticPlayers, addOptimisticPatch] = useOptimistic<
		PlayerType[],
		{ playerId: string; patch: DeepPartial<PlayerType> }
	>(players, (currentPlayers, { playerId, patch }) =>
		currentPlayers.map((player) =>
			player._id === playerId ? applyPlayerPatch(player, patch) : player,
		),
	);

	const activePlayer = useMemo(
		() => optimisticPlayers.find((p) => p._id === activePlayerId),
		[optimisticPlayers, activePlayerId],
	);

	const persistActivePlayerId = useCallback((playerId?: string) => {
		setActivePlayerId(playerId);

		if (typeof window === "undefined") {
			return;
		}

		if (playerId) {
			window.localStorage.setItem("player_id", playerId);
			return;
		}

		window.localStorage.removeItem("player_id");
	}, []);

	const resolveActivePlayerId = useCallback(
		(nextPlayers: PlayerType[], preferredPlayerId?: string) => {
			if (nextPlayers.length === 0) {
				return undefined;
			}

			if (
				preferredPlayerId &&
				nextPlayers.some((player) => player._id === preferredPlayerId)
			) {
				return preferredPlayerId;
			}

			if (typeof window !== "undefined") {
				const stored = window.localStorage.getItem("player_id");
				if (stored && nextPlayers.some((player) => player._id === stored)) {
					return stored;
				}
			}

			return nextPlayers[0]._id;
		},
		[],
	);

	useEffect(() => {
		const nextActivePlayerId = resolveActivePlayerId(players, activePlayerId);
		if (nextActivePlayerId !== activePlayerId) {
			persistActivePlayerId(nextActivePlayerId);
		}
	}, [activePlayerId, persistActivePlayerId, players, resolveActivePlayerId]);

	const patchPlayer = useCallback(
		(patch: DeepPartial<PlayerType>) => {
			if (!activePlayerId) return Promise.resolve();

			const runPatch = async () => {
				await api.mutate(
					async (currentPlayers: PlayerType[] | undefined) => {
						const currentPlayer = (currentPlayers ?? []).find(
							(player) => player._id === activePlayerId,
						);
						if (!currentPlayer) {
							return currentPlayers ?? [];
						}

						const res = await fetch(`/api/saves/${currentPlayer._id}`, {
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(patch),
						});
						if (!res.ok) {
							throw new Error(`Failed to update player: ${res.status}`);
						}

						return (currentPlayers ?? []).map((player) =>
							player._id === activePlayerId
								? applyPlayerPatch(player, patch)
								: player,
						);
					},
					{ revalidate: false },
				);
			};

			const queuedPatch = patchQueue.current.then(runPatch, runPatch);
			patchQueue.current = queuedPatch.catch(() => undefined);

			startTransition(async () => {
				addOptimisticPatch({ playerId: activePlayerId, patch });
				await queuedPatch;
			});

			return queuedPatch;
		},
		[activePlayerId, api, addOptimisticPatch],
	);

	const uploadPlayers = useCallback(
		async (nextPlayers: PlayerType[]) => {
			const res = await fetch("/api/saves", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(nextPlayers),
			});
			if (!res.ok) {
				throw new Error(`Failed to upload players: ${res.status}`);
			}

			const savedPlayers = (await res.json()) as PlayerType[];
			await api.mutate(savedPlayers, { revalidate: false });
			persistActivePlayerId(
				resolveActivePlayerId(savedPlayers, nextPlayers[0]?._id),
			);
			return savedPlayers;
		},
		[api, persistActivePlayerId, resolveActivePlayerId],
	);

	const deletePlayers = useCallback(
		async (playerId?: string) => {
			const res = await fetch("/api/saves", {
				method: "DELETE",
				headers: playerId ? { "Content-Type": "application/json" } : undefined,
				body: playerId
					? JSON.stringify({ _id: playerId, type: "player" })
					: undefined,
			});
			if (!res.ok) {
				throw new Error(`Failed to delete players: ${res.status}`);
			}

			const remainingPlayers = (await res.json()) as PlayerType[];
			await api.mutate(remainingPlayers, { revalidate: false });
			persistActivePlayerId(
				resolveActivePlayerId(
					remainingPlayers,
					playerId && activePlayerId !== playerId ? activePlayerId : undefined,
				),
			);
			return remainingPlayers;
		},
		[activePlayerId, api, persistActivePlayerId, resolveActivePlayerId],
	);

	const setActivePlayer = useCallback(
		(player?: PlayerType) => {
			persistActivePlayerId(player?._id);
		},
		[persistActivePlayerId],
	);

	return (
		<PlayersContext.Provider
			value={{
				players: optimisticPlayers,
				uploadPlayers,
				deletePlayers,
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
