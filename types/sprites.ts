import type sprites from "../research/processors/data/sprites.json";

export type Sprites = typeof sprites[keyof typeof sprites];
