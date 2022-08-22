interface ReturnType {
  fiveHeartCount: number;
  tenHeartCount: number;
  relationships: { [key: villager]: points };
}

type villager = string;
type points = number;

const ignore = new Set<string>([
  "Gunther",
  "Marlon",
  "Bouncer",
  "Mister Qi",
  "Henchman",
  "Birdie",
]);

export function parseSocial(json: any): ReturnType {
  let relationships: { [key: villager]: points } = {};
  // loop through every game location and check each NPC to see if they are datable 😵‍💫
  for (const location of json.SaveGame.locations.GameLocation) {
    if (location.characters == "") continue;

    // check if the location has a list of characters
    if (typeof location.characters.NPC.name === "undefined") {
      // more than one character at this location so we loop through them
      for (const idx in location.characters.NPC) {
        const NPC = location.characters.NPC[idx];
        if (ignore.has(NPC.name)) continue;
        if (
          typeof NPC["@_xsi:type"] !== "undefined" &&
          NPC["@_xsi:type"] !== "Child"
        )
          continue;
        relationships[NPC.name] = 0;
      }
    } else {
      // only one character at this location so we can just check that one
      const NPC = location.characters.NPC;
      if (ignore.has(NPC.name)) continue;
      if (
        typeof NPC["@_xsi:type"] !== "undefined" &&
        NPC["@_xsi:type"] !== "Child"
      )
        continue;
      relationships[NPC.name] = 0;
    }
  }

  let fiveHeartCount = 0;
  let tenHeartCount = 0;
  // new files will have only one "item" which makes it not iterable so we'll
  // catch that error and handle it separately
  if (typeof json.SaveGame.player.friendshipData.item.key === "undefined") {
    // multiple entries
    for (const idx in json.SaveGame.player.friendshipData.item) {
      let name = json.SaveGame.player.friendshipData.item[idx].key.string;
      if (ignore.has(name)) continue;

      // update the data from relationships
      let friendshipPoints =
        json.SaveGame.player.friendshipData.item[idx].value.Friendship.Points;
      if (friendshipPoints >= 1250) fiveHeartCount++;
      if (friendshipPoints >= 2500) tenHeartCount++;

      let status =
        json.SaveGame.player.friendshipData.item[idx].value.Friendship.Status;

      try {
        relationships[name] = friendshipPoints;
        // relationships[name].status = status; OUTDATED
        // console.log(status);
      } catch (e) {
        if (e instanceof TypeError) {
          // modded character or children
          relationships[name] = friendshipPoints;
          // console.log(status);
        } else throw e;
      }
    }
  } else {
    // only one entry
    let name = json.SaveGame.player.friendshipData.item.key.string;
    if (!ignore.has(name)) {
      let friendshipPoints =
        json.SaveGame.player.friendshipData.item.value.Friendship.Points;
      if (friendshipPoints >= 1250) fiveHeartCount++;
      if (friendshipPoints >= 2500) tenHeartCount++;

      let status =
        json.SaveGame.player.friendshipData.item.value.Friendship.Status;

      try {
        relationships[name] = friendshipPoints;
        // relationships[name].status = status;
        // console.log(status);
      } catch (e) {
        if (e instanceof TypeError) {
          // modded character or children
          relationships[name] = friendshipPoints;
          // console.log(status);
        } else throw e;
      }
    }
  }

  return {
    fiveHeartCount,
    tenHeartCount,
    relationships,
  };
}
