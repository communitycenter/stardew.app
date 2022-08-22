import { XMLParser } from "fast-xml-parser";
import { parseCooking } from "./parsers/cooking";
import { parseCrafting } from "./parsers/crafting";
import { parseFamily } from "./parsers/family";
import { parseFishing } from "./parsers/fishing";
import { parseGeneral } from "./parsers/general";
import { parseMoney } from "./parsers/money";
import { parseMonsters } from "./parsers/monsters";
import { parseMuseum } from "./parsers/museum";
import { parseQuests } from "./parsers/quests";
import { parseSkills } from "./parsers/skills";
import { parseSocial } from "./parsers/social";
import { parseStardrops } from "./parsers/stardrops";

const semVerGte = require("semver/functions/gte");

export async function parseSaveFile(file: any) {
  console.log("Parsing XML...");
  const start = performance.now();
  const parser = new XMLParser({ ignoreAttributes: false });
  const jsonObj = parser.parse(file);
  console.log("Parsed XML in", (performance.now() - start).toFixed(3), "ms");

  // check the version number of the SDV save file
  try {
    const gameVersion: string = jsonObj.SaveGame.gameVersion;

    // make sure the game version is at least 1.5.0
    // we can modify this later if we decide to support older versions of SDV
    if (!semVerGte(gameVersion, "1.5.0")) {
      throw new Error(
        "Please upload a save file from version 1.5.0 or newer. If you would like to request support for an older version, please contact us on Discord or open an issue on Github."
      );
    }
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "Invalid file uploaded. Couldn't find Game Version, please upload a Stardew Valley save file."
      );
    }
  }

  console.log("Parsing information...");

  // General Information
  const { name, timePlayed, farmInfo } = parseGeneral(jsonObj);
  const moneyEarned = parseMoney(jsonObj);
  const { levels, maxLevelCount } = parseSkills(jsonObj);
  const questsCompleted = parseQuests(jsonObj);
  const { stardrops, stardropsCount } = parseStardrops(jsonObj);

  // Museum
  const { artifacts, minerals, artifactsDonated, mineralsDonated } =
    parseMuseum(jsonObj);

  // Fishing
  const { allFish, totalCaught, uniqueCaught } = parseFishing(jsonObj);

  // Cooking
  const { cookedCount, knownCount, allRecipes } = parseCooking(jsonObj);

  // Crafting
  const {
    allRecipes: craftingRecipes,
    knownCount: knownCountCrafted,
    craftedCount: craftedCount,
  } = parseCrafting(jsonObj);

  // Family & social
  const { houseUpgradeLevel, spouse, children } = parseFamily(jsonObj);
  const { fiveHeartCount, tenHeartCount, relationships } = parseSocial(jsonObj);

  // Monsters
  const { deepestMineLevel, deepestSkullCavernLevel, monstersKilled } =
    parseMonsters(jsonObj);

  console.log("Parsed information!");

  console.log("Uploading values to DB");
  const dbstart = performance.now();
  let response = await fetch("/api/kv", {
    method: "PATCH",
    body: JSON.stringify({
      general: {
        name,
        timePlayed,
        farmInfo,
        moneyEarned,
        questsCompleted,
        uploadedFile: true,
      },
      stardrops: {
        count: stardropsCount,
        CF_Fair: stardrops.CF_Fair,
        CF_Fish: stardrops.CF_Fish,
        CF_Mines: stardrops.CF_Mines,
        CF_Sewer: stardrops.CF_Sewer,
        CF_Spouse: stardrops.CF_Spouse,
        CF_Statue: stardrops.CF_Statue,
        museumComplete: stardrops.museumComplete,
      },
      levels: {
        player: levels["Player"],
        farming: levels["Farming"],
        fishing: levels["Fishing"],
        foraging: levels["Foraging"],
        mining: levels["Mining"],
        combat: levels["Combat"],
        maxLevelCount,
      },
      fish: {
        totalCaught,
        uniqueCaught,
        ...allFish,
      },
      cooking: {
        cookedCount,
        knownCount,
        ...allRecipes,
      },
      crafting: {
        craftedCount,
        knownCount: knownCountCrafted,
        ...craftingRecipes,
      },
      mining: {
        deepestMineLevel,
        deepestSkullCavernLevel, // TODO: map through monstersKilled and add entry into DB for each
        ...monstersKilled,
      },
      museum: {
        ...artifacts,
        ...minerals,
        artifactsDonated,
        mineralsDonated,
      },
      family: {
        houseUpgradeLevel,
        spouse: spouse ? spouse : "No spouse",
        childrenLength: children ? children.length : 0,
      },
      social: {
        fiveHeartCount,
        tenHeartCount, // TODO: map through relationships and add entry into DB for each
      },
    }),
  });
  console.log(
    "Completed DB uploads in",
    (performance.now() - dbstart).toFixed(3),
    "ms"
  );

  const elapsed = performance.now() - start;
  console.log("Elapsed", elapsed.toFixed(3), "ms");
  return { success: true, timeTaken: (elapsed / 1000).toFixed(2) };
}
