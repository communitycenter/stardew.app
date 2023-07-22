import { XMLParser } from "fast-xml-parser";
const semverSatisfies = require("semver/functions/satisfies");

export function parseSaveFile(xml: string) {
  const start = performance.now();
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
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        "Invalid file uploaded. Please upload a valid Stardew Valley save file."
      );
    } else throw e;
  }

  let mainPlayerName = saveFile.SaveGame.player.name;
  const elapsed = performance.now() - start;
  return { timeElapsed: (elapsed / 1000).toFixed(2), message: mainPlayerName };
}
