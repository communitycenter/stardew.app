import notes from "@/data/secret_notes.json";

export interface NotesRet {
  total: number;
  found: { [key: string]: boolean };
}

export function parseNotes(player: any) {
  const notesIDs = Object.keys(notes);

  let notesObject: { [key: string]: boolean } = {};

  notesIDs.map((id) => (notesObject[id] = false));

  if (!player.secretNotesSeen.int)
    return {
      total: 0,
      found: notesObject,
    };

  const found = player.secretNotesSeen.int
    .filter((scrap: number) => scrap <= 1000)
    .map((note: number) => {
      notesObject[note] = true;
    });

  return {
    total: player.secretNotesSeen.int.filter((scrap: number) => scrap <= 1000)
      .length,
    found: notesObject,
  };
}
