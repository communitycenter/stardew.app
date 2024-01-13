import { XMLParser } from "fast-xml-parser";

import {
  findChildren,
  parseCooking,
  parseCrafting,
  parseFishing,
  parseGeneral,
  parseMonsters,
  parseMuseum,
  parsePerfection,
  parseShipping,
  parseSocial,
} from "@/lib/parsers";
import { findAllByKey } from "@/lib/utils";
import { parseNotes } from "./parsers/notes";
import { parseScraps } from "./parsers/scraps";
import { parseWalnuts } from "./parsers/walnuts";

const semverSatisfies = require("semver/functions/satisfies");

export function parseSaveFile(xml: string) {
  const parser = new XMLParser({ ignoreAttributes: false });
  let saveFile: any = null;
  try {
    saveFile = parser.parse(xml);
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "Invalid file uploaded. Couldn't parse XML. Please upload a valid Stardew Valley save file."
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

    // find the prefix to use for attributes (xsi for pc, p3 for mobile)
    const prefix =
      typeof saveFile.SaveGame["@_xmlns:xsi"] === "undefined" ? "p3" : "xsi";

    // console.log(prefix === "xsi" ? "PC" : "Mobile");

    const parsedMuseum = parseMuseum(
      saveFile.SaveGame.locations.GameLocation.find(
        (obj: any) => obj[`@_${prefix}:type`] === "LibraryMuseum"
      )
    );

    const parsedWalnuts = parseWalnuts(saveFile.SaveGame);

    // obelisks and golden clock
    const parsedPerfection = parsePerfection(prefix, saveFile.SaveGame);

    // Map of uniqueMultiplayerID to array of children names
    const children = findChildren(prefix, saveFile.SaveGame);

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
    throw e;
  }
}
