import objects from "../../research/processors/data/objects.json";

interface ReturnType {
  artifacts: Record<string, boolean>;
  minerals: Record<string, boolean>;
  artifactsDonated: number;
  mineralsDonated: number;
}

export function parseMuseum(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Treasure Trove (donate 40 items to museum).
      - A Complete Collection (donate every item to the museum).
  */

  let artifacts: Record<string, boolean> = {};
  let minerals: Record<string, boolean> = {};
  for (const key in objects) {
    if (objects[key as keyof typeof objects].category === "Arch")
      artifacts[key] = false;
    if (objects[key as keyof typeof objects].category.startsWith("Minerals"))
      minerals[key] = false;
  }

  // First we need to find the museum location
  let museumLocation = json.SaveGame.locations.GameLocation.find(
    (obj: any) => obj["@_xsi:type"] === "LibraryMuseum"
  );

  // now we check if any items have been donated
  if (museumLocation.museumPieces === "")
    return {
      artifacts,
      minerals,
      artifactsDonated: 0,
      mineralsDonated: 0,
    };

  // and if there are multiple types of items donated
  if (typeof museumLocation.museumPieces.item.key === "undefined") {
    // multiple items donated
    for (const idx in museumLocation.museumPieces.item) {
      let piece = museumLocation.museumPieces.item[idx];
      let item_id = piece.value.int.toString();

      if (artifacts.hasOwnProperty(item_id)) artifacts[item_id] = true;
      else if (minerals.hasOwnProperty(item_id)) minerals[item_id] = true;
    }
  } else {
    // only one item donated
    let piece = museumLocation.museumPieces.item;
    let item_id = piece.value.int.toString();

    if (artifacts.hasOwnProperty(item_id)) artifacts[item_id] = true;
    else if (minerals.hasOwnProperty(item_id)) minerals[item_id] = true;
  }

  const artifactsDonated = Object.values(artifacts).filter((v) => v).length;
  const mineralsDonated = Object.values(minerals).filter((v) => v).length;

  return {
    artifacts,
    minerals,
    artifactsDonated,
    mineralsDonated,
  };
}
