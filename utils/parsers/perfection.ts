interface ReturnType {
  candleCount: number;
}

export function parsePerfection(json: any): ReturnType {
  /*
    Hi again, it's Jack.

    Currently, it is an insane amount of effort to calcuate the number of candles the player has found,
    based on how many points Grandpa has given the player.

    For the most part, I'm just going to return the amount of candles & figure out how to calculate it later.

    I'm sorry if this is a bit of a mess, but I'm just trying to get this done.

    Peace,
    Jack xo
    */

  let farm = json.SaveGame.locations.GameLocation.find(
    (obj: any) => obj["@_xsi:type"] === "Farm"
  );

  return {
    candleCount: farm.grandpaScore,
  };
}
