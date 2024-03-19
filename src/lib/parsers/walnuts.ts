import type { WalnutType } from "@/types/items";

import walnut_data from "@/data/walnuts.json";
const walnuts = walnut_data as { [key: string]: WalnutType };

import { GetListOrEmpty } from "@/lib/utils";

export interface WalnutRet {
  // used to track the walnuts that can be found around the island
  found: { [key: string]: number };
  // new in 1.6: the player can essentially purchase the golden walnuts
  activatedGoldenParrot?: boolean;
}

export function parseWalnuts(save: any): WalnutRet {
  try {
    const goldenWalnutsFound = Math.min(130, save.goldenWalnutsFound ?? 0);
    const activatedGoldenParrot =
      (save.activatedGoldenParrot ?? false) === "true";

    // early return if the player activated the golden parrot
    // TODO: should we also do this if goldenWalnutsFound is 130?
    // debug perfection cmd or cheats can set this to 130, but the walnuts
    // are still in the world able to be collected
    if (activatedGoldenParrot || goldenWalnutsFound === 130) {
      return {
        found: createAllCompleted(),
        activatedGoldenParrot,
      };
    }

    let found: { [key: string]: number } = {};

    const collected = new Set<string>(
      GetListOrEmpty(save.collectedNutTracker, "string"),
    );

    const limited = GetListOrEmpty(save.limitedNutDrops, "item");

    // first, we'll go through limitedNutDrops and add the walnuts to the found list
    // removing anything we see from the collected set
    for (const item of limited) {
      const key: string = item.key.string;
      const value: number = item.value.int;

      if (key in walnuts) {
        found[key] = Math.min(walnuts[key].count, value);
        collected.delete(key);
      }
    }

    // now we'll go through the collected set and add the walnuts to the found list
    collected.forEach((key) => {
      if (key in walnuts) found[key] = walnuts[key].count;
    });

    // finally, check for golden coconut
    if ((save.goldenCoconutCracked ?? false) === "true") {
      found["GoldenCoconut"] = walnuts.GoldenCoconut.count;
    }

    return { found };
  } catch (err) {
    if (err instanceof Error)
      throw new Error(`Error in parseWalnuts: ${err.message}`);
    else throw new Error(`Error in parseWalnuts: ${err}`);
  }
}

/**
 * Creates the "found" object with all walnuts set to their completion value
 *
 * @return {*}  {{ [key: string]: number }}
 */
function createAllCompleted(): { [key: string]: number } {
  // TODO: golden parrot doesn't add Birdie 5 walnuts to limited
  // TODO: check source code to see what happens if golden parrot is activated, and player completed Birdie's quest
  let found: { [key: string]: number } = {};
  for (const key in walnuts) {
    found[key] = walnuts[key].count;
  }
  return found;
}
