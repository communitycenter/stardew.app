import shipping_items from "@/data/shipping.json";

export interface ShippingRet {
  basicShippedCount: number; // how many items have they shipped at least one of?
  polycultureCount: number; // how many crops have they shipped more than 15 of?
  monoculture: boolean; // have they shipped more than 300 of any one crop?
  shipped: { [key: number]: number }; // how many of each item have they shipped?
}

export function parseShipping(player: any): ShippingRet {
  /*
    Achievements Relevant:
      - Polyculture (ship 15 of each crop)
      - Monoculture (ship 300 of one crop)
      - Full Shipment (ship every item)
  */

  try {
    let basicShippedCount = 0;
    let polycultureCount = 0;
    let monoculture = false;
    let shipped: { [key: number]: number } = {};

    // check if player has shipped anything at all
    if (!player.basicShipped || typeof player.basicShipped === "undefined") {
      return {
        basicShippedCount,
        polycultureCount,
        monoculture,
        shipped,
      };
    }

    // item.key.int is the item ID, item.value.int is the number shipped
    if (Array.isArray(player.basicShipped.item)) {
      // player has shipped multiple items
      for (const idx in player.basicShipped.item) {
        const item = player.basicShipped.item[idx];
        const itemID = item.key.int;
        const amount = item.value.int;

        // first make sure this is a valid shipped item
        if (itemID in shipping_items) {
          // increment basicShippedCount
          basicShippedCount++;
          shipped[itemID] = amount;

          // check if this is a polyculture
          if (
            shipping_items[itemID as keyof typeof shipping_items].polyculture &&
            amount >= 15
          ) {
            polycultureCount++;
          }

          // check if this is a monoculture
          if (
            !monoculture &&
            amount >= 300 &&
            shipping_items[itemID as keyof typeof shipping_items].monoculture
          ) {
            monoculture = true;
          }
        }
      }
    } else {
      // only one shipped item
      const itemID = player.basicShipped.item.key.int;
      const amount = player.basicShipped.item.value.int;

      if (itemID in shipping_items) {
        basicShippedCount++;
        shipped[itemID] = amount;

        if (
          shipping_items[itemID as keyof typeof shipping_items].polyculture &&
          amount >= 15
        ) {
          polycultureCount++;
        }

        if (
          !monoculture &&
          amount >= 300 &&
          shipping_items[itemID as keyof typeof shipping_items].monoculture
        ) {
          monoculture = true;
        }
      }
    }

    return {
      basicShippedCount,
      polycultureCount,
      monoculture,
      shipped,
    };
  } catch (err) {
    if (err instanceof Error)
      throw new Error(`Error in parseShipping: ${err.message}`);
    else throw err;
  }
}
