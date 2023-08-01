import objects from "@/data/objects.json";

export interface MuseumRet {
  artifacts: number[];
  minerals: number[];
}

export function parseMuseum(museumLocation: any): MuseumRet {
  /*
    Achievements Relevant:
      - Treasure Trove (donate 40 items to museum).
      - A Complete Collection (donate every item to the museum).
  */

  let artifactsIds = new Set<number>();
  let mineralsIds = new Set<number>();

  let artifacts: number[] = [];
  let minerals: number[] = [];

  if (
    !museumLocation.museumPieces ||
    typeof museumLocation.museumPieces === "undefined"
  )
    return {
      artifacts,
      minerals,
    };

  // get all the artifact and mineral ids to track where it belongs
  for (const key in objects) {
    if (objects[key as keyof typeof objects].category === "Arch")
      artifactsIds.add(parseInt(key));
    if (objects[key as keyof typeof objects].category.startsWith("Minerals"))
      mineralsIds.add(parseInt(key));
  }

  if (Array.isArray(museumLocation.museumPieces.item)) {
    // multiple items donated
    for (const idx in museumLocation.museumPieces.item) {
      let piece = museumLocation.museumPieces.item[idx];
      let item_id = piece.value.int;

      if (artifactsIds.has(item_id)) artifacts.push(parseInt(item_id));
      else if (mineralsIds.has(item_id)) minerals.push(parseInt(item_id));
    }
  } else {
    // only one item donated
    let piece = museumLocation.museumPieces.item;
    let item_id = piece.value.int;

    if (artifactsIds.has(item_id)) artifacts.push(parseInt(item_id));
    else if (mineralsIds.has(item_id)) minerals.push(parseInt(item_id));
  }

  return {
    artifacts,
    minerals,
  };
}
