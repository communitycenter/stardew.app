export interface NotesRet {
  found: number[];
}

export function parseNotes(player: any) {
  if (!player.secretNotesSeen) return { found: [] };

  if (!Array.isArray(player.secretNotesSeen.int)) {
    return {
      found: [player.secretNotesSeen.int],
    };
  }

  return {
    found: [
      ...(player.secretNotesSeen.int?.filter(
        // change to be in between 1 and 25 inclusively
        (scrap: number) => scrap >= 1 && scrap <= 25
      ) ?? []),
    ],
  };
}
