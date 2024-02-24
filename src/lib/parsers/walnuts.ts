import allWalnuts from "@/data/walnuts.json";
import { WalnutType } from "@/types/items";

export interface WalnutRet {
  found: { [key: string]: number };
}

export const walnuts = allWalnuts as unknown as { [key: string]: WalnutType };

export function parseWalnuts(save: any): WalnutRet {
  //   if (!player.mailReceived.string.includes("Visited_Island")) return;
  try {
    let collectedGoldenWalnuts: string[] = [];

    if (Array.isArray(save.collectedNutTracker.string)) {
      collectedGoldenWalnuts = save.collectedNutTracker.string;
    } else {
      if (typeof save.collectedNutTracker.string !== "undefined") {
        collectedGoldenWalnuts.push(save.collectedNutTracker.string);
      }
    }

    const internalWalnutIds = Object.keys(walnuts);

    let trackedWalnutObject: { [key: string]: number } = {};

    internalWalnutIds.map((id) => (trackedWalnutObject[id] = 0));

    if (collectedGoldenWalnuts.length > 0) {
      // console.log(collectedGoldenWalnuts);
      collectedGoldenWalnuts.forEach((nut) => {
        trackedWalnutObject[nut] = walnuts[nut as keyof typeof walnuts].num;
      });
    }

    trackedWalnutObject["GoldenCoconut"] = save.goldenCoconutCracked
      ? walnuts.GoldenCoconut.num
      : 0;

    if (!save.limitedNutDrops?.item?.length)
      return {
        found: trackedWalnutObject,
      };

    (save.limitedNutDrops?.item ?? []).forEach((k: any) => {
      trackedWalnutObject[k.key.string as string] = k.value.int as number;
    });

    return {
      found: trackedWalnutObject,
    };
  } catch (err) {
    if (err instanceof Error)
      throw new Error(`Error in walnuts: ${err.message}`);
    else throw err;
  }
}
