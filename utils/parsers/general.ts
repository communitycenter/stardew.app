function msToTime(time: number): string {
  // Hours, minutes and seconds
  const hrs = Math.floor(time / 3600000);
  const mins = Math.floor((time % 3600000) / 60000);

  return `${hrs}h ${mins}m`;
}

interface ReturnType {
  name: string;
  timePlayed: string;
  farmInfo: string;
}

export function parseGeneral(json: any): ReturnType {
  let farmTypes = [
    "Standard",
    "Riverland",
    "Forest",
    "Hill-top",
    "Wilderness",
    "Four Corners",
    "Beach",
  ];

  const name = json.SaveGame.player.name;
  const timePlayed = msToTime(json.SaveGame.player.millisecondsPlayed);

  // the farm type is stored under SaveGame > whichFarm which is a number 0-6
  // which corresponds to the farmTypes above.
  const farmInfo = `${json.SaveGame.player.farmName} Farm (${
    farmTypes[json.SaveGame.whichFarm]
  })`;
  return { name, timePlayed, farmInfo };
}
