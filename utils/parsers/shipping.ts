// https://github.com/MouseyPounds/stardew-checkup/blob/master/stardew-checkup.js#L2122
import shipping_items from "../../research/processors/data/shipment.json";

type itemID = string;

/*

Dear MouseyPounds
Thank you dearly for the bottom JSON that was taken from Stardew Checkup.
I think I would have gone insane trying to type all of these out.

Best,
Jack LaFond

*/

const polycultureCrops = {
  // Some, but not all of "Basic -75" category (All veg except fiddlehead)
  24: "Parsnip",
  188: "Green Bean",
  190: "Cauliflower",
  192: "Potato",
  248: "Garlic",
  250: "Kale",
  256: "Tomato",
  262: "Wheat",
  264: "Radish",
  266: "Red Cabbage",
  270: "Corn",
  272: "Eggplant",
  274: "Artichoke",
  276: "Pumpkin",
  278: "Bok Choy",
  280: "Yam",
  284: "Beet",
  300: "Amaranth",
  304: "Hops",
  // Some, but not all of "Basic -79" category (All fruit except Ancient, tree & forageables)
  252: "Rhubarb",
  254: "Melon",
  258: "Blueberry",
  260: "Hot Pepper",
  268: "Starfruit",
  282: "Cranberries",
  398: "Grape",
  400: "Strawberry",
  // Others
  433: "Coffee Bean",
};

const monocultureCrops = {
  // Ancient Fruit and 4 of the "Basic -80" flowers
  454: "Ancient Fruit",
  591: "Tulip",
  593: "Summer Spangle",
  595: "Fairy Rose",
  597: "Blue Jazz",
};

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

      if (polycultureCrops.hasOwnProperty(item_id)) {
      }
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
