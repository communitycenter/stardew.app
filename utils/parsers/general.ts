interface ReturnType {
  name: string;
  timePlayed: string;
  farmInfo: string;
  secretNotesFound: number;
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
  let secretNotesFound = 0;

  // the farm type is stored under SaveGame > whichFarm which is a number 0-6
  // which corresponds to the farmTypes above.
  const farmInfo = `${json.SaveGame.player.farmName} Farm (${
    farmTypes[json.SaveGame.whichFarm]
  })`;

  // Check if user even has seen any secret notes, if not return 0
  if (!json.SaveGame.player.secretNotesSeen.int) {
    secretNotesFound = 0;
  } else {
    // Filter notes below 1000 to find secret notes, then return length of array
    secretNotesFound = json.SaveGame.player.secretNotesSeen.int.filter(
      (scrap: number) => scrap <= 1000
    ).length;
  }

  return { name, timePlayed, farmInfo, secretNotesFound };
}
