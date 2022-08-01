interface ReturnType {
  fiveHeartCount: number;
  tenHeartCount: number;
  relationships: Relationship[];
}

type Relationship = {
  name: {
    friendshipPoints: number;
    hearts: number;
    isDateable: boolean;
  };
};

export function parseSocial(json: any): ReturnType {
  const dateableNPCs = new Set<string>();
  // loop through every game location and check each NPC to see if they are datable 😵‍💫
  for (const location of json.SaveGame.locations.GameLocation) {
    for (const NPCs of location.characters.NPC ? location.characters.NPC : []) {
      if (NPCs.datable == "true") dateableNPCs.add(NPCs.name);
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
      name: {
        friendshipPoints: friendshipPts,
        hearts: Math.floor(friendshipPts / 250),
        isDateable: dateableNPCs.has(name),
      },
    });
  }

  return {
    fiveHeartCount,
    tenHeartCount,
    relationships,
  };
}
