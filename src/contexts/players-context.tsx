import {
  createContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
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
  players: Player[] | null;
  setPlayers: Dispatch<SetStateAction<Player[] | null>>;
  activePlayer: Player | null;
  setActivePlayer: Dispatch<SetStateAction<Player | null>>;
}

export const PlayersContext = createContext<PlayersContextProps>({
  players: null,
  setPlayers: () => {},
  activePlayer: null,
  setActivePlayer: () => {},
});

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (players) {
      setActivePlayer(players[0]);
    }
  }, [players]);

  return (
    <PlayersContext.Provider
      value={{ players, setPlayers, activePlayer, setActivePlayer }}
    >
      {children}
    </PlayersContext.Provider>
  );
};
