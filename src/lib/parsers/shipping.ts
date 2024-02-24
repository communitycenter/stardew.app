import shipping_items from "@/data/shipping.json";

import { deweaponize } from "../utils";

const semverSatisfies = require("semver/functions/satisfies");

export interface ShippingRet {
  // basicShippedCount: number; // how many items have they shipped at least one of?
  // polycultureCount: number; // how many crops have they shipped more than 15 of?
  // monoculture: boolean; // have they shipped more than 300 of any one crop?
  shipped: { [key: string]: number | null }; // how many of each item have they shipped?
}

export function parseShipping(player: any, gameVersion: string): ShippingRet {
  /*
    Achievements Relevant:
      - Polyculture (ship 15 of each crop)
      - Monoculture (ship 300 of one crop)
      - Full Shipment (ship every item)
  */

  try {
    let shipped: { [key: string]: number } = {};

    // check if player has shipped anything at all
    if (!player.basicShipped || typeof player.basicShipped === "undefined") {
      return { shipped };
    }

    // item.key.int is the item ID, item.value.int is the number shipped
    // in >=1.6, item.key.string is the item ID
    if (Array.isArray(player.basicShipped.item)) {
      // player has shipped multiple items
      for (const idx in player.basicShipped.item) {
        const item = player.basicShipped.item[idx];
        const amount = item.value.int;
        let itemID: string;

        if (semverSatisfies(gameVersion, ">=1.6")) {
          itemID = deweaponize(item.key.string).value;
        } else {
          itemID = item.key.int.toString();
        }

        // first make sure this is a valid shipped item
        if (itemID in shipping_items) {
          shipped[itemID] = amount;
        }
      }
    } else {
      // only one shipped item
      const amount = player.basicShipped.item.value.int;
      let itemID: string;
      if (semverSatisfies(gameVersion, ">=1.6")) {
        itemID = deweaponize(player.basicShipped.item.key.string).value;
      } else {
        itemID = player.basicShipped.item.key.int.toString();
      }

      if (itemID in shipping_items) {
        shipped[itemID] = amount;
      }
    }

    return { shipped };
  } catch (err) {
    if (err instanceof Error)
      throw new Error(`Error in parseShipping: ${err.message}`);
    else throw err;
  }
}
