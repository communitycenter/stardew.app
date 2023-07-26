interface Fish {
  itemID: number;
  locations: string[];
  trapFish: false;
  difficulty: string;
  time: string;
  seasons: string[];
  weather: string;
  minLevel: string;
}

interface TrapFish {
  itemID: number;
  locations: string[];
  trapFish: true;
}

export type FishType = Fish | TrapFish;
