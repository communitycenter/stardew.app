interface ReturnType {
  stardropsCount: number;
  stardropsNeeded: string[] | null;
}

const STARDROPS: Record<string, string> = {
  CF_Fair: "Can be purchased at the Stardew Valley Fair for 2,000 star tokens.", 
  CF_Fish: "Received in mail from Willy after completing the Master Angler Achievement.",
  CF_Mines: "Obtained from the treasure chest on floor 100 in The Mines.",
  CF_Sewer: "Can be purchased from Krobus for 20,000g in The Sewers.",
  CF_Spouse: "Obtained from spouse after reaching a friendship level of 12.5 hearts.",
  CF_Statue: "Obtained from Old Master Cannoli in the Secret Woods after giving him a Sweet Gem Berry.",
  museumComplete: "Reward for donating all 95 items to the Museum."
}

export function parseStardrops(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Mystery Of The Stardrops (Find every stardrop).
  */
  let count = 0;
  let found = new Set<string>();
  let needed: string[] = [];

  // loop through all the mail recieved and look for the stardrops
  for (const mail of json.SaveGame.player.mailReceived.string as string) {
    if (STARDROPS.hasOwnProperty(mail)) {
      count++;
      found.add(mail);
    }

    if (count == Object.keys(STARDROPS).length) { // we found all the stardrops
      return {
        stardropsCount: count,
        stardropsNeeded: null,
      }
    }
  }

  // now we need to loop through all the stardrops and see if we found them
  // if we didn't find them, we can push their description to the needed array
  for (const key in STARDROPS) {
    if (!found.has(key)) {
      needed.push(STARDROPS[key]);
    }
  }
  
  return {
    stardropsCount: count,
    stardropsNeeded: needed,
  }
}