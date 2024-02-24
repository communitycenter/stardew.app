import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const semverSatisfies = require("semver/functions/satisfies");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get a list of all farmhands in the save file.
 *
 * @param {*} saveGame The entire save game object from `saveFile.SaveGame`
 * @return {*} An array of farmhand objects
 */
export function getAllFarmhands(saveGame: any): any[] {
  let farmhands: any[] = [];
  const version: string = saveGame.gameVersion;

  if (saveGame.player) {
    farmhands.push(saveGame.player);
  }

  if (semverSatisfies(version, "<1.6.0")) {
    // we'll need to recursively find all farmhands for <1.6
    farmhands = farmhands.concat(findAllByKey(saveGame, "farmhand"));
  } else {
    // for the new 1.6 format, there's a <farmhands> array tag with <Farmer> objects
    if (saveGame.farmhands && saveGame.farmhands.Farmer) {
      if (Array.isArray(saveGame.farmhands.Farmer)) {
        // multiple farmhands so we'll concat them
        farmhands = farmhands.concat(saveGame.farmhands.Farmer);
      } else {
        // only one farmhand
        farmhands.push(saveGame.farmhands.Farmer);
      }
    }
  }

  return farmhands;
}

function findAllByKey(obj: any, searchKey: string) {
  let results: any[] = [];

  Object.keys(obj).forEach((key) => {
    if (key === searchKey) {
      let farmhand = obj[key];

      if (!farmhand.name || !farmhand.UniqueMultiplayerID) {
        return;
      }

      results.push(obj[key]);
    } else if (typeof obj[key] === "object" && key !== "player") {
      results = results.concat(findAllByKey(obj[key], searchKey));
    }
  });
  return results;
}

export function deweaponize(incoming: string) {
  let str = incoming.toString();
  if (str.startsWith("(")) {
    const split = str.split(")");
    return {
      key: split[0].replace("(", ""),
      value: split[1].trim(),
    };
  } else {
    return {
      key: "",
      value: str,
    };
  }
}
