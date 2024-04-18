export interface ItemData {
  itemID: string;
  minVersion: string;
}

interface Fishable extends ItemData {
  locations: string[];
  trapFish: boolean;
}

interface Fish extends Fishable {
  difficulty: string;
  minLevel: number;
  seasons: string[];
  time: string;
  trapFish: false;
  weather: string;
}

interface TrapFish extends Fishable {
  trapFish: true;
}

export type FishType = Fish | TrapFish;

export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconURL: string;
}

export interface ShippingItem extends ItemData {
  polyculture: boolean;
  monoculture: boolean;
  seasons: string[];
}

export interface MuseumItem extends ItemData {
  locations?: string[];
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
