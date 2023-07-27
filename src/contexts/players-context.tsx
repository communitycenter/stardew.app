import {
  createContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";

import { GeneralRet } from "@/lib/parsers/parseGeneral";
import { FishRet } from "@/lib/parsers/parseFishing";

// TODO: Are we gonna specify the type of this or we just do any?
interface Player {
  general: GeneralRet;
  fishing: FishRet;
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
