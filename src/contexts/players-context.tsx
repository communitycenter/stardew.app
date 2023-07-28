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

// TODO: Are we gonna specify the type of this or we just do any?
interface Player {
  general: GeneralRet;
  fishing: FishRet;
  cooking: CookingRet;
  crafting: CraftingRet;
  shipping: ShippingRet;
  id: string;
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
