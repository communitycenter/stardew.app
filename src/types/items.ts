interface Fish {
  itemID: number;
  name: string;
  iconURL: string;
  description: string;
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
  name: string;
  iconURL: string;
  description: string;
  locations: string[];
  trapFish: true;
}

export type FishType = Fish | TrapFish;
