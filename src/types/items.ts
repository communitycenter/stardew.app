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

export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconURL: string;
}

export interface ShippingItem {
  itemID: number;
  polyculture: boolean;
  monoculture: boolean;
}

export interface TrinketItem {
  locations?: string[];
  used_in?: string[];
  itemID: string;
}
