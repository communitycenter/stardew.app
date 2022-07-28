import type bundles from "../research/processors/bundles.json";

export type Bundles = typeof bundles[keyof typeof bundles];
