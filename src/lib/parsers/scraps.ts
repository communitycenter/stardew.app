export interface ScrapsRet {
  found: number[];
}

export function parseScraps(player: any) {
  if (!player.secretNotesSeen) return { found: [] };

  if (!Array.isArray(player.secretNotesSeen.int)) {
    return {
      found:
        player.secretNotesSeen.int >= 1000 ? [player.secretNotesSeen.int] : [],
    };
  }

  return {
    found: [
      ...(player.secretNotesSeen.int?.filter(
        (scrap: number) => scrap >= 1000
      ) ?? []),
    ],
  };
}
