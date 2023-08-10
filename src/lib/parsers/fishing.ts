import fishes from "@/data/fish.json";

export interface FishRet {
  totalCaught?: number;
  fishCaught: number[];
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
    const totalCaught = player.stats.fishCaught;

    const fishCaught: number[] = [];

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
        let itemID = fish.key.int.toString();

        // some things you can catch aren't fish or don't count
        if (!fishes.hasOwnProperty(itemID)) continue;

        fishCaught.push(parseInt(itemID));
      }
    } else {
      // only one type of fish caught
      let fish = player.fishCaught.item;
      let itemID = fish.key.int.toString();

      // some things you can catch aren't fish or don't count
      if (fishes.hasOwnProperty(itemID)) {
        fishCaught.push(parseInt(itemID));
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
