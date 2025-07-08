// Response types for all Stardew Valley parsers
// This file exports all the return types from the various parsers

// Bundle parser response types - imported from bundles.ts

// Fishing parser response types
export interface FishRet {
  totalCaught?: number;
  fishCaught: string[];
}

// Shipping parser response types
export interface ShippingRet {
  shipped: { [key: string]: number | null };
}

// Museum parser response types
export interface MuseumRet {
  artifacts?: string[];
  minerals?: string[];
}

// Cooking parser response types
export interface CookingRet {
  recipes: { [key: string]: 0 | 1 | 2 };
}

// Crafting parser response types
export interface CraftingRet {
  recipes: { [key: string]: 0 | 1 | 2 };
}

// Social parser response types
export interface Relationship {
  points: number;
  status?: string;
}

export interface SocialRet {
  childrenCount?: number;
  houseUpgradeLevel?: number;
  spouse?: string | null;
  relationships: { [key: string]: Relationship };
}

// Monsters parser response types
export interface MonstersRet {
  deepestMineLevel?: number;
  deepestSkullCavernLevel?: number;
  monstersKilled: Record<string, number>;
}

// Perfection parser response types
export interface PerfectionRet {
  numObelisks?: number;
  goldenClock?: boolean;
  perfectionWaivers?: number;
}

// Powers parser response types
export interface PowersRet {
  collection?: string[];
  MasteryExp?: number;
}

// Notes parser response types
export interface NotesRet {
  found: number[];
}

// Scraps parser response types
export interface ScrapsRet {
  found: number[];
}

// Walnuts parser response types
export interface WalnutRet {
  found: { [key: string]: number };
  activatedGoldenParrot?: boolean;
}

// Animals parser response types
export interface FarmAnimal {
  name: string;
  type: string;
  age: number;
  friendshipTowardFarmer: number;
  happiness: number;
}

export interface Pet {
  name: string;
  type: string;
  friendship: number;
}

export interface AnimalsRet {
  farmAnimals: FarmAnimal[];
  pets: Pet[];
}

// General parser response types
export type Stardrop =
  | "CF_Fair"
  | "CF_Fish"
  | "CF_Mines"
  | "CF_Sewer"
  | "CF_Spouse"
  | "CF_Statue"
  | "museumComplete";

export type StardropsRet = Stardrop[];

export type Skill =
  | "farming"
  | "fishing"
  | "foraging"
  | "mining"
  | "combat"
  | "luck";
export type SkillsRet = Record<Skill, number>;
export type ExperienceRet = Record<Skill, number>;

export type JojaMail =
  | "jojaCraftsRoom"
  | "jojaBoilerRoom"
  | "jojaVault"
  | "jojaPantry"
  | "jojaFishTank"
  | "ccMovieTheaterJoja";

export interface JojaRet {
  isMember: boolean;
  developmentProjects: JojaMail[];
}

export type AchievementsRet = Number[];

export interface GeneralRet {
  name?: string;
  timePlayed?: string;
  farmInfo?: string;
  totalMoneyEarned?: number;
  skills?: SkillsRet;
  questsCompleted?: number;
  stardrops?: StardropsRet;
  experience?: ExperienceRet;
  gameVersion?: string;
  jojaMembership?: JojaRet;
  achievements?: AchievementsRet;
}

// Re-export existing types for convenience
export type { Power, MonsterGoal, PlayerKey, QueryCondition } from "./data";

export type {
  ItemData,
  FishType,
  Achievement,
  ShippingItem,
  MuseumItem,
  WalnutType,
  WalnutMapType,
  Villager,
} from "./items";

// Import specific bundle types needed for PlayerData interface
import type { BundleWithStatus } from "./bundles";

// Re-export bundle types for convenience
export type {
  Bundle,
  BundleItem,
  BundleWithStatus,
  CommunityCenterRoomName,
  ItemQuality,
  Randomizer,
  CommunityCenterRoom,
  CommunityCenter,
} from "./bundles";

// Main PlayerData interface that represents the complete parsed player data
export interface PlayerData {
  _id: string;
  general: GeneralRet;
  bundles: BundleWithStatus[];
  fishing: FishRet;
  cooking: CookingRet;
  crafting: CraftingRet;
  shipping: ShippingRet;
  museum: MuseumRet;
  social: SocialRet;
  monsters: MonstersRet;
  walnuts: WalnutRet;
  notes: NotesRet;
  scraps: ScrapsRet;
  perfection: PerfectionRet;
  powers: PowersRet;
  animals?: AnimalsRet; // Optional as it's not fully implemented yet
}
