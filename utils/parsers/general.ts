interface ReturnType {
  name: string;
  timePlayed: string;
  farmInfo: string;
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

  // the farm type is stored under SaveGame > whichFarm which is a number 0-6
  // which corresponds to the farmTypes above.
  const farmInfo = `${json.SaveGame.player.farmName} Farm (${
    farmTypes[json.SaveGame.whichFarm]
  })`;
  return { name, timePlayed, farmInfo };
}
