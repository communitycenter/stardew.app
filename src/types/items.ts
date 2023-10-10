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
  seasons: string[];
}

export interface TrinketItem {
  locations?: string[];
  used_in?: string[];
  itemID: string;
}

export interface WalnutType {
  name: string;
  num: number;
  description: string;
  iconURL: string;
}

export interface WalnutMapType {
  [key: string]: WalnutType;
}

export interface Villager {
  name: string;
  iconURL: string;
  birthday: string;
  datable: boolean;
  loves: number[];
  likes: number[];
}
