import type walnuts from "../research/processors/data/walnuts.json";

export type Walnuts = typeof walnuts[keyof typeof walnuts];
