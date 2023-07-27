import fishes from "@/data/fish.json";

export interface FishRet {
  totalCaught: number;
  uniqueCaught: number;
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
  const totalCaught = player.stats.fishCaught;
  let uniqueCaught = 0;

  const fishCaught: number[] = [];

  if (
    totalCaught === 0 ||
    !player.fishCaught ||
    typeof player.fishCaught === "undefined"
  ) {
    return {
      totalCaught,
      uniqueCaught,
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

      uniqueCaught++;
      fishCaught.push(parseInt(itemID));
    }
  } else {
    // only one type of fish caught
    let fish = player.fishCaught.item;
    let itemID = fish.key.int.toString();

    // some things you can catch aren't fish or don't count
    if (fishes.hasOwnProperty(itemID)) {
      uniqueCaught++;
      fishCaught.push(parseInt(itemID));
    }
  }

  return {
    totalCaught,
    uniqueCaught,
    fishCaught,
  };
}
