export type PlayerKey = "Any" | "All" | "Current" | "Target" | "Host";
export type QueryCondition = "mail" | "event" | "stat";

export interface Power {
	description: string | null;
	flag: string;
	minVersion: string;
	name: string;
	playerKey: PlayerKey;
	type: QueryCondition;
}

export interface MonsterGoal {
	count: number;
	reward: string;
	targets: string[];
}

export interface FarmAnimal {
	name: string;
	type: string;
	age: number;
	friendship: number;
	happiness: number;
}

export interface Pet {
	name: string;
	type: string;
	friendship: number;
}

export interface AnimalsData {
	farmAnimals: FarmAnimal[];
	pets: Pet[];
	horse?: string;
}
