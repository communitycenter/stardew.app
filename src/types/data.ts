export interface Power {
  description: string | null;
  flag: string;
  name: string;
  playerKey: "Any" | "All" | "Current" | "Target" | "Host";
  type: "mail" | "event" | "stat";
}
