import notes from "../../research/processors/data/secret_notes.json";

interface ReturnType {
  name: string;
  timePlayed: string;
  farmInfo: string;
  secretNotesFound: { [key: string]: boolean };
}

function msToTime(time: number): string {
  const hrs = Math.floor(time / 3600000);
  const mins = Math.floor((time % 3600000) / 60000);

  return `${hrs}h ${mins}m`;
}

const farmTypes = [
  "Standard",
  "Riverland",
  "Forest",
  "Hill-top",
  "Wilderness",
  "Four Corners",
  "Beach",
];

export function parseGeneral(json: any): ReturnType {
  const name = json.SaveGame.player.name;
  const timePlayed = msToTime(json.SaveGame.player.millisecondsPlayed);

  // Get all IDs of the secret notes
  const notesIDs = Object.keys(notes);

  // Make an empty object that we're eventually gonna return
  let notesObject: { [key: string]: boolean } = {};

  // For each walnut event, set it to a default value of 0
  notesIDs.map((id) => (notesObject[id] = false));

  // the farm type is stored under SaveGame > whichFarm which is a number 0-6
  // which corresponds to the farmTypes above.
  const farmInfo = `${json.SaveGame.player.farmName} Farm (${
    farmTypes[json.SaveGame.whichFarm]
  })`;

  if (!json.SaveGame.player.secretNotesSeen.int) {
    return { name, timePlayed, farmInfo, secretNotesFound: notesObject };
  } else {
    const secretNotesFound = json.SaveGame.player.secretNotesSeen.int.filter(
      (scrap: number) => scrap <= 1000
    );
    secretNotesFound.map((note: number) => {
      notesObject[note] = true;
    });

    return { name, timePlayed, farmInfo, secretNotesFound: notesObject };
  }
}
