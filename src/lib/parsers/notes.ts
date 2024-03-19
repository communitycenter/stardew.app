export interface NotesRet {
  found: number[];
}

export function parseNotes(player: any): NotesRet {
  try {
    let found: number[] = [];

    if (
      !player.secretNotesSeen ||
      typeof player.secretNotesSeen === "undefined"
    )
      return { found };

    if (Array.isArray(player.secretNotesSeen.int)) {
      // multiple notes found
      for (const idx in player.secretNotesSeen.int) {
        let note = player.secretNotesSeen.int[idx];

        // secret notes are less than 1000, journal scraps are >= 1000
        if (note >= 1 && note < 1000) found.push(note);
      }
    } else {
      // only one note found
      let note = player.secretNotesSeen.int;
      if (note >= 1 && note < 1000) found.push(note);
    }

    return { found };
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parseNotes: ${e.message}`);
    else throw new Error(`Error in parseNotes: ${e}`);
  }
}
