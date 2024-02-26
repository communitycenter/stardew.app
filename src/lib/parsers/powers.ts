import { GetStatValue } from "../utils";

export const books: {
  [key: string]: { type: string; host: boolean; flag: string; name: string };
} = {
  Book_AnimalCatalogue: {
    type: "stats",
    host: false,
    flag: "Book_AnimalCatalogue",
    name: "Animal Catalogue",
  },
  Book_Artifact: {
    type: "stats",
    host: false,
    flag: "Book_Artifact",
    name: "Artifact Collection",
  },
  Book_Bombs: {
    type: "stats",
    host: false,
    flag: "Book_Bombs",
    name: "Bombs",
  },
  Book_Crabbing: {
    type: "stats",
    host: false,
    flag: "Book_Crabbing",
    name: "Crabbing",
  },
  Book_Defense: {
    type: "stats",
    host: false,
    flag: "Book_Defense",
    name: "Defense",
  },
  Book_Diamonds: {
    type: "stats",
    host: false,
    flag: "Book_Diamonds",
    name: "Diamonds",
  },
  Book_Friendship: {
    type: "stats",
    host: false,
    flag: "Book_Friendship",
    name: "Friendship",
  },
  Book_Grass: {
    type: "stats",
    host: false,
    flag: "Book_Grass",
    name: "Grass Starter",
  },
  Book_Horse: {
    type: "stats",
    host: false,
    flag: "Book_Horse",
    name: "Horse",
  },
  Book_Marlon: {
    type: "stats",
    host: false,
    flag: "Book_Marlon",
    name: "Marlon",
  },
  Book_Mystery: {
    type: "stats",
    host: false,
    flag: "Book_Mystery",
    name: "Mystery",
  },
  Book_PriceCatalogue: {
    type: "stats",
    host: false,
    flag: "Book_PriceCatalogue",
    name: "Price Catalogue",
  },
  Book_Roe: {
    type: "stats",
    host: false,
    flag: "Book_Roe",
    name: "Roe",
  },
  Book_Speed: {
    type: "stats",
    host: false,
    flag: "Book_Speed",
    name: "Speed",
  },
  Book_Speed2: {
    type: "stats",
    host: false,
    flag: "Book_Speed2",
    name: "Speed (2)",
  },
  Book_Trash: {
    type: "stats",
    host: false,
    flag: "Book_Trash",
    name: "Trash",
  },
  Book_Void: {
    type: "stats",
    host: false,
    flag: "Book_Void",
    name: "Void",
  },
  Book_WildSeeds: {
    type: "stats",
    host: false,
    flag: "Book_WildSeeds",
    name: "Wild Seeds",
  },
  Book_Woodcutting: {
    type: "stats",
    host: false,
    flag: "Book_Woodcutting",
    name: "Woodcutting",
  },
};

export const otherPowers: {
  [key: string]: { type: string; host: boolean; flag: string; name: string };
} = {
  BearPaw: {
    type: "event",
    host: false,
    flag: "2120303",
    name: "Bear's Knowledge",
  },
  ClubCard: {
    type: "mail",
    host: false,
    flag: "HasClubCard",
    name: "Qi Club Card",
  },
  DarkTalisman: {
    type: "mail",
    host: false,
    flag: "HasDarkTalisman",
    name: "Dark Talisman",
  },
  DwarvishTranslationGuide: {
    type: "mail",
    host: true,
    flag: "HasDwarvishTranslationGuide",
    name: "Dwarvish Translation Guide",
  },
  ForestMagic: {
    type: "mail",
    host: false,
    flag: "canReadJunimoText",
    name: "Forest Magic",
  },
  KeyToTheTown: {
    type: "mail",
    host: false,
    flag: "HasTownKey",
    name: "Key to the Town",
  },
  MagicInk: {
    type: "mail",
    host: false,
    flag: "HasMagicInk",
    name: "Magic Ink",
  },
  MagnifyingGlass: {
    type: "mail",
    host: false,
    flag: "HasMagnifyingGlass",
    name: "Magnifying Glass",
  },
  Mastery_Combat: {
    type: "stats",
    host: false,
    flag: "mastery_4",
    name: "Combat Mastery Perk",
  },
  Mastery_Farming: {
    type: "stats",
    host: false,
    flag: "mastery_0",
    name: "Farming Mastery Perk",
  },
  Mastery_Fishing: {
    type: "stats",
    host: false,
    flag: "mastery_1",
    name: "Fishing Mastery Perk",
  },
  Mastery_Foraging: {
    type: "stats",
    host: false,
    flag: "mastery_2",
    name: "Foraging Mastery Perk",
  },
  Mastery_Mining: {
    type: "stats",
    host: false,
    flag: "mastery_3",
    name: "Mining Mastery Perk",
  },
  RustyKey: {
    type: "mail",
    host: true,
    flag: "HasRustyKey",
    name: "Rusty Key",
  },
  SkullKey: {
    type: "mail",
    host: true,
    flag: "HasSkullKey",
    name: "Skull Key",
  },
  SpecialCharm: {
    type: "mail",
    host: false,
    flag: "HasSpecialCharm",
    name: "Special Charm",
  },
  SpringOnionMastery: {
    type: "event",
    host: false,
    flag: "3910979",
    name: "Spring Onion Mastery",
  },
};

export function parsePowers(players: any) {
  const host = players[0]["UniqueMultiplayerID"];
  const result = {} as any;

  for (const playerId in players) {
    const currentPlayer = players[playerId];
    const currentPlayerId = currentPlayer["UniqueMultiplayerID"];

    result[currentPlayerId] = {
      books: [],
      other: []
    };

    // Check books
    for (const bookKey in books) {
      const book = books[bookKey];
      if (GetStatValue(currentPlayer.stats.Values, book.flag) === 1) {
        result[currentPlayerId].books.push(book.flag);
      }
    }

    // Check other powers
    for (const powerKey in otherPowers) {
      const power = otherPowers[powerKey];
      let value = false;

      switch (power.type) {
        case "event":
          value = currentPlayer.eventsSeen.int.includes(power.flag);
          break;
        case "mail":
          value = currentPlayer.mailReceived.string.includes(power.flag);
          break;
        case "stats":
          value = GetStatValue(currentPlayer.stats.Values, power.flag) === 1;
          break;
      }

      if (value) {
        result[currentPlayerId].other.push(power.flag);
      }
    }
  }

  // Host-specific objects
  const hostFlags = Object.values(otherPowers)
    .filter(power => power.host)
    .map(power => power.flag);

  // For each host flag, check if host has it and add it to all players
  for (const flag of hostFlags) {
    if (result[host]?.other.includes(flag)) {
      for (const playerId in result) {
        result[playerId].other.push(flag);
      }
    }
  }

  return result;
}
