// 1.6 changelog, 2/21/2024:
// We changed everything to strings. Why didn't we do this before?

import fishes from "@/data/fish.json";

import { deweaponize, isPlayerFormatUpdated, GetStatValue } from "../utils";

const semverSatisfies = require("semver/functions/satisfies");

export interface FishRet {
  totalCaught?: number;
  fishCaught: string[];
}

export function parseFishing(player: any, gameVersion: string): FishRet {
  /*
    Achievements Relevant:
      - Mother Catch (catch 100 total fish).
      - Fisherman (catch 10 different fish).
      - Ol' Mariner (catch 24 different fish).
      - Master Angler (catch every type of fish).
  */
  try {
    const playerFormatUpdated = isPlayerFormatUpdated(player);

    let totalCaught = 0;

    if (playerFormatUpdated) {
      totalCaught = GetStatValue(player.stats.Values, "fishCaught");
    } else {
      totalCaught = player.stats.fishCaught;
    }

    const fishCaught: string[] = [];

    if (!player.fishCaught || typeof player.fishCaught === "undefined") {
      return { totalCaught, fishCaught };
    }

    if (Array.isArray(player.fishCaught.item)) {
      // multiple types of fish caught
      for (const idx in player.fishCaught.item) {
        let fish = player.fishCaught.item[idx];
        let itemID: string;

        // we'll need to check the save version of the file as 1.6 applies a change
        // to all item keys from int to strings for fishCaught. Player format updated
        // is not enough to determine this.
        if (semverSatisfies(gameVersion, ">=1.6")) {
          itemID = deweaponize(fish.key.string).value;
        } else {
          itemID = fish.key.int.toString();
        }

        // some things you can catch aren't fish or don't count
        if (fishes.hasOwnProperty(itemID)) fishCaught.push(itemID);
      }
    } else {
      // only one type of fish caught
      let fish = player.fishCaught.item;
      let itemID: string;

      if (semverSatisfies(gameVersion, ">=1.6")) {
        itemID = deweaponize(fish.key.string).value;
      } else {
        itemID = fish.key.int.toString();
      }

      // some things you can catch aren't fish or don't count
      if (fishes.hasOwnProperty(itemID)) fishCaught.push(itemID);
    }

    return { totalCaught, fishCaught };
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parseFishing: ${e.message}`);
    else throw new Error(`Error in parseFishing: ${e}`);
  }
}
