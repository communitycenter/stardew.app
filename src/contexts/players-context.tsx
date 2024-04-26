import useSWR from "swr";

import {
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  createContext,
} from "react";

import type { CookingRet } from "@/lib/parsers/cooking";
import type { CraftingRet } from "@/lib/parsers/crafting";
import type { FishRet } from "@/lib/parsers/fishing";
import type { GeneralRet } from "@/lib/parsers/general";
import type { MonstersRet } from "@/lib/parsers/monsters";
import type { MuseumRet } from "@/lib/parsers/museum";
import type { NotesRet } from "@/lib/parsers/notes";
import type { PerfectionRet } from "@/lib/parsers/perfection";
import type { ScrapsRet } from "@/lib/parsers/scraps";
import type { ShippingRet } from "@/lib/parsers/shipping";
import type { SocialRet } from "@/lib/parsers/social";
import type { WalnutRet } from "@/lib/parsers/walnuts";
import type { PowersRet } from "@/lib/parsers/powers";
import { BundleWithStatus } from "@/types/bundles";
import { DeepPartial } from "react-hook-form";

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
  // @ts-expect-error
  uploadPlayers: () => {},
  patchPlayer: () => Promise.resolve(),
  setActivePlayer: () => {},
});

export function isObject(item: any) {
  return item && typeof item === "object"; // && !Array.isArray(item);
}

// Takes an inbound patch and converts any array keys into dereferenced
// arrays, since apparently json_merge_patch doesn't recurse into arrays
function normalizePatch(patch: any, target: any, inArray = false) {
  if (!isObject(patch)) return patch;
  const new_patch = Array.isArray(patch) ? [...patch] : { ...patch };
  for (const key in patch) {
    if (Array.isArray(target[key]) && !Array.isArray(patch[key])) {
      new_patch[key] = [...target[key]];
      for (const arrIndex in patch[key]) {
        new_patch[key][arrIndex] = normalizePatch(
          patch[key][arrIndex],
          target[key][arrIndex],
          true,
        );
      }
    } else {
      new_patch[key] = normalizePatch(patch[key], target[key], inArray);
    }
  }
  if (inArray) {
    for (const field in target) {
      if (!(field in new_patch)) {
        new_patch[field] = target[field];
      }
    }
  }
  return new_patch;
}

export function mergeDeep(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();
  const new_target = Array.isArray(target) ? [...target] : { ...target };

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(new_target, { [key]: {} });
        Object.assign(new_target, {
          [key]: mergeDeep(new_target[key], source[key]),
        });
      } else {
        Object.assign(new_target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(new_target, ...sources);
}

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const api = useSWR<PlayerType[]>("/api/saves", (...args) =>
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
      setActivePlayerId(players[0]._id);
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
          console.log("Normalizing patch:");
          console.dir(normalizedPatch);
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
