export interface NotesRet {
  found: number[];
}

export function parseNotes(player: any) {
  return {
    found: [
      ...(player.secretNotesSeen.int?.filter(
        (scrap: number) => scrap <= 1000
      ) ?? []),
    ],
  };
}
