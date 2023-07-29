import objects from "@/data/objects.json";

export interface MuseumRet {
  artifacts: number[];
  minerals: number[];
}

export function parseMuseum(museumLocation: any): MuseumRet {
  console.log(museumLocation);
  /*
    Achievements Relevant:
      - Treasure Trove (donate 40 items to museum).
      - A Complete Collection (donate every item to the museum).
  */

  let artifactsIds: number[] = [];
  let mineralsIds: number[] = [];

  let artifacts: number[] = [];
  let minerals: number[] = [];

  for (const key in objects) {
    if (objects[key as keyof typeof objects].category === "Arch")
      artifactsIds.push(parseInt(key));
    if (objects[key as keyof typeof objects].category.startsWith("Minerals"))
      mineralsIds.push(parseInt(key));
  }

  // now we check if any items have been donated
  if (museumLocation.museumPieces === "")
    return {
      artifacts,
      minerals,
    };

  // and if there are multiple types of items donated
  if (typeof museumLocation.museumPieces.item.key === "undefined") {
    // multiple items donated
    for (const idx in museumLocation.museumPieces.item) {
      let piece = museumLocation.museumPieces.item[idx];
      let item_id = piece.value.int;

      if (artifactsIds.includes(item_id)) artifacts.push(parseInt(item_id));
      else if (mineralsIds.includes(item_id)) minerals.push(parseInt(item_id));
    }
  } else {
    // only one item donated
    let piece = museumLocation.museumPieces.item;
    let item_id = piece.value.int;

    if (artifactsIds.includes(item_id)) artifacts.push(parseInt(item_id));
    else if (mineralsIds.includes(item_id)) minerals.push(parseInt(item_id));
  }

  return {
    artifacts,
    minerals,
  };
}
