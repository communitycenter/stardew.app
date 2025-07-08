import objects from "../data/objects.json";

const semverSatisfies = require("semver/functions/satisfies");

export interface MuseumRet {
  artifacts?: string[];
  minerals?: string[];
}

export function parseMuseum(
  museumLocation: any,
  gameVersion: string
): MuseumRet {
  /*
    Achievements Relevant:
      - Treasure Trove (donate 40 items to museum).
      - A Complete Collection (donate every item to the museum).
  */

  let artifactsIds = new Set<string>();
  let mineralsIds = new Set<string>();

  let artifacts: string[] = [];
  let minerals: string[] = [];

  if (
    !museumLocation.museumPieces ||
    typeof museumLocation.museumPieces === "undefined"
  )
    return { artifacts, minerals };

  // get all the artifact and mineral ids to track where it belongs
  for (const key in objects) {
    if (objects[key as keyof typeof objects].category === "Artifact")
      artifactsIds.add(key);
    if (objects[key as keyof typeof objects].category === "Mineral")
      mineralsIds.add(key);
  }

  if (Array.isArray(museumLocation.museumPieces.item)) {
    // multiple items donated
    for (const idx in museumLocation.museumPieces.item) {
      let piece = museumLocation.museumPieces.item[idx];
      let item_id: string;

      if (semverSatisfies(gameVersion, ">=1.6")) {
        item_id = piece.value.string.toString();
      } else {
        item_id = piece.value.int.toString();
      }

      if (artifactsIds.has(item_id)) artifacts.push(item_id);
      else if (mineralsIds.has(item_id)) minerals.push(item_id);
    }
  } else {
    // only one item donated
    let piece = museumLocation.museumPieces.item;
    let item_id: string;

    if (semverSatisfies(gameVersion, ">=1.6")) {
      item_id = piece.value.string;
    } else {
      item_id = piece.value.int.toString();
    }

    if (artifactsIds.has(item_id)) artifacts.push(item_id);
    else if (mineralsIds.has(item_id)) minerals.push(item_id);
  }

  return { artifacts, minerals };
}
