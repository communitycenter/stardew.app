import scraps from "@/data/journal_scraps.json";

export interface ScrapsRet {
  found: number[];
}

export function parseScraps(player: any) {
  return {
    found: [
      ...(player.secretNotesSeen.int?.filter(
        (scrap: number) => scrap >= 1000
      ) ?? []),
    ],
  };
}
