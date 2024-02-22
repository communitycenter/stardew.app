// 1.6 changelog, 2/21/2024:
// We changed everything to strings. Why didn't we do this before?

import fishes from "@/data/fish.json";
import { deweaponize } from "../utils";

export interface FishRet {
  totalCaught?: number;
  fishCaught: string[];
}

export function parseFishing(player: any): FishRet {
  /*
    Achievements Relevant:
      - Mother Catch (catch 100 total fish).
      - Fisherman (catch 10 different fish).
      - Ol' Mariner (catch 24 different fish).
      - Master Angler (catch every type of fish).
  */
  try {
    const totalCaught = player.stats.Values.item.find(
      (obj: any) => obj.key.string === "fishCaught"
    ).value.unsignedInt;

    const fishCaught: string[] = [];

    if (
      totalCaught === 0 ||
      !player.fishCaught ||
      typeof player.fishCaught === "undefined"
    ) {
      return {
        totalCaught,
        fishCaught,
      };
    }

    if (Array.isArray(player.fishCaught.item)) {
      // multiple types of fish caught
      for (const idx in player.fishCaught.item) {
        let fish = player.fishCaught.item[idx];
        let itemID = deweaponize(fish.key.string);

        // some things you can catch aren't fish or don't count
        if (!fishes.hasOwnProperty(itemID.value)) continue;

        fishCaught.push(itemID.value);
      }
    } else {
      // only one type of fish caught
      let fish = player.fishCaught.item;
      let itemID = deweaponize(fish.key.string);

      // some things you can catch aren't fish or don't count
      if (fishes.hasOwnProperty(itemID.value)) {
        fishCaught.push(itemID.value);
      }
    }

    return {
      totalCaught,
      fishCaught,
    };
  } catch (e) {
    let msg = "";
    if (e instanceof Error) {
      msg = e.message;
    }
    throw new Error(`Error in parseFishing(): ${msg}`);
  }
}
