interface Fish {
  difficulty: string;
  itemID: string;
  locations: string[];
  minLevel: number;
  minVersion: string;
  seasons: string[];
  time: string;
  trapFish: false;
  weather: string;
}

interface TrapFish {
  itemID: string;
  locations: string[];
  minVersion: string;
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
  itemID: string;
  polyculture: boolean;
  minVersion: string;
  monoculture: boolean;
  seasons: string[];
}

export interface MuseumItem {
  locations?: string[];
  itemID: string;
}

export interface WalnutType {
  name: string;
  count: number;
  description: string;
}

export interface WalnutMapType {
  [key: string]: WalnutType;
}

export interface Villager {
  birthday: string;
  datable: boolean;
  iconURL: string;
  loves: string[];
  name: string;
}
