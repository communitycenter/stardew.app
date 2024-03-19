export interface ScrapsRet {
  found: number[];
}

export function parseScraps(player: any): ScrapsRet {
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
        let scrap = player.secretNotesSeen.int[idx];

        // secret notes are less than 1000, journal scraps are >= 1000
        if (scrap >= 1000) found.push(scrap);
      }
    } else {
      // only one note found
      let scrap = player.secretNotesSeen.int;
      if (scrap >= 1000) found.push(scrap);
    }

    return { found };
  } catch (e) {
    if (e instanceof Error)
      throw new Error(`Error in parseNotes: ${e.message}`);
    else throw new Error(`Error in parseNotes: ${e}`);
  }
}
