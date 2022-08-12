interface ReturnType {
  stardropsCount: number;
  stardrops: Record<string, boolean>;
}

const STARDROPS = {
  CF_Fair: "Can be purchased at the Stardew Valley Fair for 2,000 star tokens.",
  CF_Fish:
    "Received in mail from Willy after completing the Master Angler Achievement.",
  CF_Mines: "Obtained from the treasure chest on floor 100 in The Mines.",
  CF_Sewer: "Can be purchased from Krobus for 20,000g in The Sewers.",
  CF_Spouse:
    "Obtained from spouse after reaching a friendship level of 12.5 hearts.",
  CF_Statue:
    "Obtained from Old Master Cannoli in the Secret Woods after giving him a Sweet Gem Berry.",
  museumComplete: "Reward for donating all 95 items to the Museum.",
};

export function parseStardrops(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Mystery Of The Stardrops (Find every stardrop).
  */

  let count = 0;
  let stardrops: Record<string, boolean> = {};

  // initialize stardrops to false
  for (const key in STARDROPS) {
    stardrops[key] = false;
  }

  // loop through all the mail recieved and look for the stardrops
  if (typeof json.SaveGame.player.mailReceived.string === "object") {
    for (const idx in json.SaveGame.player.mailReceived.string) {
      let mail = json.SaveGame.player.mailReceived.string[idx];
      if (STARDROPS.hasOwnProperty(mail)) {
        count++;
        stardrops[mail] = true;
      }

      if (count === Object.keys(STARDROPS).length) {
        return {
          stardropsCount: count,
          stardrops,
        };
      }
    }
  } else {
    // there's only one entry in mailReceived
    if (json.SaveGame.player.mailReceived["string"] in STARDROPS) {
      count++;
      stardrops[json.SaveGame.player.mailReceived["string"]] = true;
    }
  }

  // // now we need to loop through all the stardrops and see if we found them
  // // if we didn't find them, we can push their description to the needed array
  // for (const key in STARDROPS) {
  //   if (!found.has(key)) {
  //     needed.push(STARDROPS[key as keyof typeof STARDROPS]);
  //   }
  // }

  return {
    stardropsCount: count,
    stardrops,
  };
}
