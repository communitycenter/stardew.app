import useSWR from "swr";

import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import type { FishRet } from "@/lib/parsers/fishing";
import type { CookingRet } from "@/lib/parsers/cooking";
import type { GeneralRet } from "@/lib/parsers/general";
import type { CraftingRet } from "@/lib/parsers/crafting";
import type { ShippingRet } from "@/lib/parsers/shipping";
import type { MuseumRet } from "@/lib/parsers/museum";
import type { SocialRet } from "@/lib/parsers/social";
import type { MonstersRet } from "@/lib/parsers/monsters";
import type { WalnutRet } from "@/lib/parsers/walnuts";
import type { NotesRet } from "@/lib/parsers/notes";
import type { ScrapsRet } from "@/lib/parsers/scraps";
import type { PerfectionRet } from "@/lib/parsers/perfection";

interface Player {
  _id: string;
  general?: GeneralRet;
  fishing?: FishRet;
  cooking?: CookingRet;
  crafting?: CraftingRet;
  shipping?: ShippingRet;
  museum?: MuseumRet;
  social?: SocialRet;
  monsters?: MonstersRet;
  walnuts: WalnutRet;
  notes?: NotesRet;
  scraps?: ScrapsRet;
  perfection?: PerfectionRet;
}

interface PlayersContextProps {
  players?: Player[];
  uploadPlayers: (players: Player[]) => void;
  patchPlayer: (patch: Partial<Player>) => Promise<void>;
  activePlayer?: Player;
  setActivePlayer: (player?: Player) => void;
}

export const PlayersContext = createContext<PlayersContextProps>({
  uploadPlayers: () => {},
  patchPlayer: () => Promise.resolve(),
  setActivePlayer: () => {},
});

export function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function mergeDeep(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const api = useSWR<Player[]>("/api/saves", (...args) =>
    // @ts-expect-error
    fetch(...args).then((res) => res.json())
  );
  const [activePlayerId, setActivePlayerId] = useState<string>();
  const players = useMemo(() => api.data ?? [], [api.data]);
  const activePlayer = useMemo(
    () => players.find((p) => p._id === activePlayerId),
    [players, activePlayerId]
  );

  useEffect(() => {
    if (!activePlayerId && players.length > 0) {
      setActivePlayerId(players[0]._id);
    }
  }, [activePlayerId, players]);

  const patchPlayer = useCallback(
    async (patch: Partial<Player>) => {
      if (!activePlayer) return;
      const patchPlayers = (players: Player[] | undefined) =>
        (players ?? []).map((p) => {
          if (p._id === activePlayer._id) {
            return mergeDeep(p, patch);
          }
          return p;
        });
      await api.mutate(
        async (currentPlayers: Player[] | undefined) => {
          await fetch(`/api/saves/${activePlayer._id}`, {
            method: "PATCH",
            body: JSON.stringify(patch),
          });
          return patchPlayers(currentPlayers);
        },
        { optimisticData: patchPlayers }
      );
    },
    [activePlayer, api]
  );

  const uploadPlayers = useCallback(
    async (players: Player[]) => {
      await fetch("/api/saves", {
        method: "POST",
        body: JSON.stringify(players),
      });
      await api.mutate(players);
      setActivePlayerId(players[0]._id);
    },
    [api, setActivePlayerId]
  );

  const setActivePlayer = useCallback((player?: Player) => {
    if (!player) {
      setActivePlayerId(undefined);
      return;
    }
    setActivePlayerId(player._id);
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
