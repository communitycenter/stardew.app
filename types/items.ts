import type fishes from "../research/processors/data/fish.json";

export type Fish = typeof fishes[keyof typeof fishes];
