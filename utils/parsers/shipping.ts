// https://github.com/MouseyPounds/stardew-checkup/blob/master/stardew-checkup.js#L2122
import shipping_items from "../../research/processors/data/shipment.json";

type itemID = string;

interface ReturnType {
  itemsShipped: Record<string, number>;
  numItems: number;
}

export function parseShipping(json: any): ReturnType {
  /*
    Achievements Relevant:
      - Full Shipment (ship every item).
      - Monoculture (ship 300 of one crop).
      - Polyculture (ship 15 of each crop).
  */

  const itemsShipped: Record<itemID, number> = {};
  for (const key in shipping_items) {
    itemsShipped[key] = 0;
  }

  // check to see if ANY items have been shipped
  if (json.SaveGame.player.basicShipped === "")
    return { itemsShipped, numItems: 0 };

  let numItems = 0;
  // check to see if there are multiple types of items shipped
  if (typeof json.SaveGame.player.basicShipped.item.key === "undefined") {
    // multiple types of items shipped
    for (const idx in json.SaveGame.player.basicShipped.item) {
      let item = json.SaveGame.player.basicShipped.item[idx];
      let item_id = item.key.int.toString() as itemID;

      // some things you can ship but aren't items or don't count towards the achievement
      // like the items you ship on Mr. Qi's quest
      if (!itemsShipped.hasOwnProperty(item_id)) continue;
      itemsShipped[item_id] = item.value.int;
      if (item.value.int > 0) numItems++;
    }
  } else {
    // only one type of item shipped
    let item = json.SaveGame.player.basicShipped.item;
    let item_id = item.key.int.toString() as itemID;

    if (!itemsShipped.hasOwnProperty(item_id))
      return { itemsShipped, numItems };
    itemsShipped[item_id] = item.value.int;
    if (item.value.int > 0) numItems++;
  }

  return { itemsShipped, numItems };
}
