interface ReturnType {
  houseUpgradeLevel: number;
  spouse: string | null;
  children: string[] | null;
}

export function parseFamily(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Moving Up (house upgrade #1).
      - Living Large (house upgrade #2).
      - Full House (married + 2 kids)
  */

  let houseUpgradeLevel = json.SaveGame.player.houseUpgradeLevel;

  let children = [];
  let spouse = json.SaveGame.player.spouse;
  if (typeof spouse === "undefined") spouse = null;

  let FarmHouse = json.SaveGame.locations.GameLocation.find(
    (obj: any) => obj["@_xsi:type"] === "FarmHouse"
  );

  // characters could be undefined hence the check
  for (const NPCs of FarmHouse.characters.NPC ? FarmHouse.characters.NPC : []) {
    if (NPCs["@_xsi:type"] === "Child") {
      children.push(NPCs.name);
    }
  }

  return {
    houseUpgradeLevel,
    spouse,
    children: children.length > 0 ? children : null,
  };
}
