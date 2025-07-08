import { XMLParser } from "fast-xml-parser";

import {
  findChildren,
  parseBundles,
  parseCooking,
  parseCrafting,
  parseFishing,
  parseGeneral,
  parseMonsters,
  parseMuseum,
  parsePerfection,
  parseShipping,
  parseSocial,
  parsePowers,
  parseNotes,
  parseScraps,
  parseWalnuts,
  monsters,
} from "./parsers";
import {
  GetListOrEmpty,
  getAllFarmhands,
  deweaponize,
  isPlayerFormatUpdated,
  GetStatValue,
  hasOrWillReceiveMail,
  getMasteryExpNeededForLevel,
  getCurrentMasteryLevel,
} from "./utils";

export * from "./types/responses";
import type { PlayerData } from "./types/responses";

// Export utility functions for external use
export {
  GetListOrEmpty,
  getAllFarmhands,
  deweaponize,
  isPlayerFormatUpdated,
  GetStatValue,
  hasOrWillReceiveMail,
  getMasteryExpNeededForLevel,
  getCurrentMasteryLevel,
  monsters,
};

const semverSatisfies = require("semver/functions/satisfies");
const semverCoerce = require("semver/functions/coerce");

export function parseSaveFile(xml: string): PlayerData[] {
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
    let versionString: string = "";
    if (!saveFile.SaveGame.gameVersion) {
      versionString = "1.4.5"; // assume 1.4.5 if gameVersion is not present
    } else {
      versionString = saveFile.SaveGame.gameVersion.toString();
    }

    const version = semverCoerce(versionString).version;

    // make sure game version is at least 1.5.0
    if (!semverSatisfies(version, ">=1.5.0 <1.7")) {
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

    const parsedBundles = parseBundles(
      saveFile.SaveGame.bundleData,
      saveFile.SaveGame.locations.GameLocation.find(
        (obj: any) => obj[`@_${prefix}:type`] === "CommunityCenter"
      ),
      version
    );

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

    // get the saveGame.player's mailReceived, mailForTomorrow, mailbox so we don't
    // have to recompute it for each player
    const hostMailReceived = new Set<string>(
      GetListOrEmpty(saveFile.SaveGame.player.mailReceived, "string")
    );
    const hostMailForTomorrow = new Set<string>(
      GetListOrEmpty(saveFile.SaveGame.player.mailForTomorrow, "string")
    );
    const hostMailbox = new Set<string>(
      GetListOrEmpty(saveFile.SaveGame.player.mailbox, "string")
    );

    players.forEach((player) => {
      // in here is where we'll call all our parsers and create the player object we'll use
      let processedPlayer = {
        _id: player.UniqueMultiplayerID,
        general: parseGeneral(
          player,
          saveFile.SaveGame.whichFarm.toString(),
          version
        ),
        bundles: parsedBundles,
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
        powers: parsePowers(
          player,
          version,
          saveFile.SaveGame.player.UniqueMultiplayerID.toString(),
          hostMailReceived,
          hostMailForTomorrow,
          hostMailbox
        ),
        // TODO: add animals parser
        // animals: parseAnimals(
        //   saveFile.SaveGame.locations.GameLocation,
        //   saveFile.SaveGame.farmCharacters,
        //   saveFile.SaveGame.farmHouseCharacters,
        //   prefix
        // ),
      };
      processedPlayers.push(processedPlayer);
    });

    return processedPlayers;
  } catch (e) {
    throw new Error(`${e}`);
  }
}
