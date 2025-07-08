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
