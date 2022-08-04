interface ReturnType {
  houseUpgradeLevel: number;
  spouse?: string;
  children?: string[];
}

export function parseFamily(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Moving Up (house upgrade #1).
      - Living Large (house upgrade #2).
      - Full House (married + 2 kids)
  */

  let houseUpgradeLevel: number = json.SaveGame.player.houseUpgradeLevel;

  let FarmHouse = json.SaveGame.locations.GameLocation.find(
    (obj: any) => obj["@_xsi:type"] === "FarmHouse"
  );

  // if no NPCs are in the house, then we can just return houseUpgradeLevel
  if (typeof FarmHouse.characters === "string") return { houseUpgradeLevel };

  let children: string[] = [];
  let spouse: string = json.SaveGame.player.spouse;
  // if there are NPCs in the house, then we need to find the children
  // but we also check if theres only one NPC in the house bc then the NPC type is not a list
  if (typeof FarmHouse.characters.NPC.name === "undefined") {
    // NPC is a list so we can iterate through it
    for (const idx in FarmHouse.characters.NPC) {
      let NPC = FarmHouse.characters.NPC[idx];
      if (NPC["@_xsi:type"] === "Child") {
        children.push(NPC.name);
      }
    }
  } else {
    // NPC is not a list so we can just check if it is a child
    if (FarmHouse.characters.NPC["@_xsi:type"] === "Child")
      children.push(FarmHouse.characters.NPC.name);
  }

  return {
    houseUpgradeLevel,
    spouse,
    children: children.length > 0 ? children : undefined,
  };
}
