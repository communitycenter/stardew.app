import walnuts from "../../research/processors/data/walnuts.json";
import { Walnuts } from "../../types/walnuts";

interface ReturnType {
  hasVisitedIsland: boolean;
  journalScrapsFound: number;
  goldenWalnutsFound: number;
  goldenWalnutsCalculated: number;
  walnutsFound: { [key: string]: number };
}

export function parseGingerIsland(json: any): ReturnType {
  let hasVisitedIsland;
  let journalScrapsFound;
  let goldenWalnutsFound;
  let goldenWalnutsCalculated;

  // Check if player has received the mail about Ginger Island
  hasVisitedIsland =
    json.SaveGame.player.mailReceived.string.includes("Visited_Island");

  // Check if user even has seen any secret notes, if not return 0
  if (!json.SaveGame.player.secretNotesSeen.int) {
    journalScrapsFound = 0;
  } else {
    // Filter notes above 1000 to find journal scraps, then return length of array
    journalScrapsFound = json.SaveGame.player.secretNotesSeen.int.filter(
      (scrap: number) => scrap >= 1000
    ).length;
  }

  // Check how many golden walnuts the player has found
  goldenWalnutsFound = json.SaveGame.goldenWalnutsFound;

  // This will be the value that is calculated and returned post-parsing
  let calculatedGoldenWalnutsFound = 0;

  /*
  Dear future code reviewer,
  My condolences for the following code. It's actually 1:25am, and I'm just
  incredibly lost at how ConcernedApe does any amount of data storage.

  collectedNutTracker got me going crazy. I don't understand why there are so many
  different types of events, and they're all tracked differently? S'all good tho.

  Big shoutout to MouseyPounds, for which (again) much of the walnut code is based on.
  I could probably do it myself, but the mere thought of out the internal tracking ID for each
  walnut event makes me want to nuke the entire repository.

  Peace and love,
  Jack x
  */

  // Check if player has collected any nuts
  const collectedNormalNuts: string[] =
    json.SaveGame.collectedNutTracker.string ?? [];

  // Get all IDs of the walnut events
  const walnutIDs = Object.keys(walnuts);

  // Make an empty object that we're eventually gonna return
  let walnutObject: { [key: string]: number } = {};

  // For each walnut event, set it to a default value of 0
  walnutIDs.map((id) => (walnutObject[id] = 0));

  // For each walnut event in collectedNormalNuts, take the walnut count and add it to walnutObject
  collectedNormalNuts.forEach((nut) => {
    walnutObject[nut] = walnuts[nut as keyof typeof walnuts].num;
  });

  // Get if the player cracked the golden coconut for a walnut - if they did, add the amount to walnutObject
  const goldenCoconutCracked = json.SaveGame.goldenCoconutCracked;
  walnutObject["GoldenCoconut"] = goldenCoconutCracked
    ? walnuts.GoldenCoconut.num
    : 0;

  // Get the limited event nuts the player has collected, and add them to the walnutObject
  const collectedLimitedNuts = json.SaveGame.limitedNutDrops.item;
  if (collectedLimitedNuts) {
    // @ts-ignore // I know I'm not supposed to use this, but I actually don't care
    collectedLimitedNuts.map((k) => {
      walnutObject[k.key.string] = k.value.int;
    });
  }

  console.log(walnutObject);

  // Calculate the amount of golden walnuts the player has found based on the game's code
  goldenWalnutsCalculated = Object.entries(walnutObject).reduce(
    (a, b) => a + b[1],
    0
  );

  return {
    hasVisitedIsland,
    journalScrapsFound,
    goldenWalnutsFound,
    goldenWalnutsCalculated,
    walnutsFound: walnutObject,
  };
}
