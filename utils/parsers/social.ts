interface ReturnType {
  fiveHeartCount: number;
  tenHeartCount: number;
  relationships: Relationship[];
}

type Relationship = {
  name: string;
  friendshipPoints: number;
  hearts: number;
  isDateable: boolean;
};

export function parseSocial(json: any): ReturnType {
  const dateableNPCs = new Set<string>();
  // loop through every game location and check each NPC to see if they are datable 😵‍💫
  for (const location of json.SaveGame.locations.GameLocation) {
    for (const NPC in location.characters) {
      const foundNPC = location.characters[NPC];
      if (foundNPC.datable) {
        dateableNPCs.add(foundNPC.name);
      }
    }
  }

  let fiveHeartCount = 0;
  let tenHeartCount = 0;
  let relationships: Relationship[] = [];

  for (const person of json.SaveGame.player.friendshipData.item) {
    let name: string = person.key.string;
    let friendshipPts: number = person.value.Friendship.Points;

    if (friendshipPts >= 1250) fiveHeartCount++;
    if (friendshipPts >= 2500) tenHeartCount++;

    relationships.push({
      name,
      friendshipPoints: friendshipPts,
      hearts: Math.floor(friendshipPts / 250),
      isDateable: dateableNPCs.has(name),
    });
  }

  return {
    fiveHeartCount,
    tenHeartCount,
    relationships,
  };
}
