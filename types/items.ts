import type fishes from "../research/processors/fish.json";

export type Fish = typeof fishes[keyof typeof fishes];
