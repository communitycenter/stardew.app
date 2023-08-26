export interface NotesRet {
  found: number[];
}

export function parseNotes(player: any) {
  return {
    found: [
      ...(player.secretNotesSeen.int?.filter(
        // change to be in between 1 and 25 inclusively
        (scrap: number) => scrap >= 1 && scrap <= 25
      ) ?? []),
    ],
  };
}
