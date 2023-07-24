import { XMLParser } from "fast-xml-parser";

import { findAllByKey } from "@/lib/utils";
import { parseGeneral } from "@/lib/parsers/parseGeneral";

const semverSatisfies = require("semver/functions/satisfies");

export function parseSaveFile(xml: string) {
  const parser = new XMLParser({ ignoreAttributes: false });
  const saveFile = parser.parse(xml);

  try {
    const version = saveFile.SaveGame.gameVersion;

    // make sure game version is at least 1.5.0
    if (!semverSatisfies(version, ">=1.5.0 || <1.6")) {
      throw new Error(
        `Game version ${version} is not supported. stardew.app currently only supports the Stardew Valley 1.5 update.`
      );
    }

    // Now we can begin parsing the save file
    let players: any[] = [];
    // searches for all players in the save file and returns an array
    // objects are unprocessed and will be used to parse each player's data
    players = findAllByKey(saveFile.SaveGame, "farmhand");
    let processedPlayers: any[] = [];

    players.forEach((player) => {
      // in here is where we'll call all our parsers and create the player object we'll use
      let processedPlayer = {
        general: parseGeneral(player, saveFile.SaveGame.whichFarm),
        id: player.UniqueMultiplayerID,
      };
      processedPlayers.push(processedPlayer);
    });

    console.log(processedPlayers);
    return processedPlayers;
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "Invalid file uploaded. Please upload a valid Stardew Valley save file."
      );
    } else throw e;
  }

  // let mainPlayerName = saveFile.SaveGame.player.name;
  // const elapsed = performance.now() - start;
  // return { timeElapsed: (elapsed / 1000).toFixed(2), players: h };
}
