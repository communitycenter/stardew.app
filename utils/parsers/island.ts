interface ReturnType {
  hasVisitedIsland: boolean;
  journalScrapsFound: number;
  goldenWalnutsFound: number;
}

export function parseGingerIsland(json: any): ReturnType {
  let hasVisitedIsland;
  let journalScrapsFound;
  let goldenWalnutsFound;

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

  //Check how many golden walnuts the player has found
  goldenWalnutsFound = json.SaveGame.goldenWalnutsFound;

  return {
    hasVisitedIsland,
    journalScrapsFound,
    goldenWalnutsFound,
  };
}
