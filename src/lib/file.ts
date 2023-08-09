import { XMLParser } from "fast-xml-parser";

import { findAllByKey } from "@/lib/utils";
import {
  parseGeneral,
  parseFishing,
  parseCooking,
  parseCrafting,
  parseShipping,
  parseMuseum,
  findChildren,
  parseSocial,
  parseMonsters,
  parsePerfection,
} from "@/lib/parsers";
import { parseWalnuts } from "./parsers/walnuts";
import { parseNotes } from "./parsers/notes";
import { parseScraps } from "./parsers/scraps";

const semverSatisfies = require("semver/functions/satisfies");

export function parseSaveFile(xml: string) {
  const parser = new XMLParser({ ignoreAttributes: false });
  let saveFile: any = null;
  try {
    saveFile = parser.parse(xml);
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "Invalid file uploaded. Please upload a valid Stardew Valley save file."
      );
    } else throw e;
  }

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
    const parsedMuseum = parseMuseum(
      saveFile.SaveGame.locations.GameLocation.find(
        (obj: any) => obj["@_xsi:type"] === "LibraryMuseum"
      )
    );

    const parsedWalnuts = parseWalnuts(saveFile.SaveGame);

    // obelisks and golden clock
    const parsedPerfection = parsePerfection(saveFile.SaveGame);

    // Map of uniqueMultiplayerID to array of children names
    const children = findChildren(saveFile.SaveGame);

    let processedPlayers: any[] = [];

    players.forEach((player) => {
      // in here is where we'll call all our parsers and create the player object we'll use
      let processedPlayer = {
        _id: player.UniqueMultiplayerID,
        general: parseGeneral(player, saveFile.SaveGame.whichFarm),
        fishing: parseFishing(player),
        cooking: parseCooking(player),
        crafting: parseCrafting(player),
        shipping: parseShipping(player),
        museum: parsedMuseum,
        social: parseSocial(player, children),
        monsters: parseMonsters(player),
        walnuts: parsedWalnuts,
        notes: parseNotes(player),
        scraps: parseScraps(player),
        perfection: parsedPerfection,
      };
      processedPlayers.push(processedPlayer);
    });

    // console.log(processedPlayers);
    return processedPlayers;
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "Invalid file uploaded. Please upload a valid Stardew Valley save file."
      );
    } else throw e;
  }
}
