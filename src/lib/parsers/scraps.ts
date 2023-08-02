import scraps from "@/data/journal_scraps.json";

export interface ScrapsRet {
  total: number;
  found: { [key: string]: boolean };
}

export function parseScraps(player: any) {
  const notesIDs = Object.keys(scraps);

  let scrapsObject: { [key: string]: boolean } = {};

  notesIDs.map((id) => (scrapsObject[id] = false));

  if (!player.secretNotesSeen.int)
    return {
      total: 0,
      found: scrapsObject,
    };

  player.secretNotesSeen.int
    .filter((scrap: number) => scrap >= 1000)
    .map((note: number) => {
      scrapsObject[note] = true;
    });

  return {
    total: player.secretNotesSeen.int.filter((scrap: number) => scrap >= 1000)
      .length,
    found: scrapsObject,
  };
}
