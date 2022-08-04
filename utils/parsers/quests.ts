export function parseQuests(json: any): number {
  /*
    Achievements Relevant:
      - Gofer (complete at least 10 quests).
      - A Big Help (complete at least 40 quests).
  */

  let questsCompleted: number = json.SaveGame.player.stats.questsCompleted;
  return questsCompleted;
}
