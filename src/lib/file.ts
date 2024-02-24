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
import { parseNotes } from "./parsers/notes";
import { parseScraps } from "./parsers/scraps";
import { parseWalnuts } from "./parsers/walnuts";
import { getAllFarmhands, isPlayerFormatUpdated } from "@/lib/utils";

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
    const version = saveFile.SaveGame.gameVersion.toString();

    // make sure game version is at least 1.5.0
    if (!semverSatisfies(version, ">=1.5.0 || <1.7")) {
      throw new Error(
        `Game version ${version} is not supported. stardew.app currently only supports the Stardew Valley 1.5 and 1.6 updates.`
      );
    }

    // Now we can begin parsing the save file
    let players: any[] = [];

    // searches for all players in the save file and returns an array
    // objects are unprocessed and will be used to parse each player's data
    players = getAllFarmhands(saveFile.SaveGame);

    // find the prefix to use for attributes (xsi for pc, p3 for mobile)
    const prefix =
      typeof saveFile.SaveGame["@_xmlns:xsi"] === "undefined" ? "p3" : "xsi";

    // console.log(prefix === "xsi" ? "PC" : "Mobile");

    const parsedMuseum = parseMuseum(
      saveFile.SaveGame.locations.GameLocation.find(
        (obj: any) => obj[`@_${prefix}:type`] === "LibraryMuseum"
      ),
      version
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
        general: parseGeneral(
          player,
          saveFile.SaveGame.whichFarm.toString(),
          version
        ),
        fishing: parseFishing(player, version),
        cooking: parseCooking(player, version),
        crafting: parseCrafting(player),
        shipping: parseShipping(player, version),
        museum: parsedMuseum,
        social: parseSocial(
          player,
          children,
          saveFile.SaveGame.farmerFriendships
            ? saveFile.SaveGame.farmerFriendships
            : null
        ),
        monsters: parseMonsters(player),
        walnuts: parsedWalnuts,
        notes: parseNotes(player),
        scraps: parseScraps(player),
        perfection: parsedPerfection,
      };
      processedPlayers.push(processedPlayer);
    });

    return processedPlayers;
  } catch (e) {
    throw e;
  }
}
