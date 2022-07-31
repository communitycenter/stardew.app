interface ReturnType {
  questsCompleted: number;
  Gofer: boolean;
  "A Big Help": boolean;
}

export function parseQuests(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Gofer (complete at least 10 quests).
      - A Big Help (complete at least 40 quests).
  */
 
  let questsCompleted: number = json.SaveGame.player.stats.questsCompleted;
  return {
    questsCompleted,
    Gofer: questsCompleted >= 10,
    "A Big Help": questsCompleted >= 40,
  }
}