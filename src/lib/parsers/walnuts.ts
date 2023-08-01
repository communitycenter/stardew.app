import walnuts from "@/data/walnuts.json";

export interface WalnutRet {
  total: number;
  found: { [key: string]: number };
}

export function parseWalnuts(save: any): any {
  //   if (!player.mailReceived.string.includes("Visited_Island")) return;

  console.log(save.goldenWalnutsFound);

  const collectedGoldenWalnuts: string[] =
    save.collectedNutTracker.string ?? [];

  const internalWalnutIds = Object.keys(walnuts);

  let trackedWalnutObject: { [key: string]: number } = {};

  internalWalnutIds.map((id) => (trackedWalnutObject[id] = 0));

  collectedGoldenWalnuts.forEach((nut) => {
    trackedWalnutObject[nut] = walnuts[nut as keyof typeof walnuts].num;
  });

  trackedWalnutObject["GoldenCoconut"] = save.goldenCoconutCracked
    ? walnuts.GoldenCoconut.num
    : 0;

  (save.limitedNutDrops?.item ?? []).forEach((k: any) => {
    trackedWalnutObject[k.key.string as string] = k.value.int as number;
  });

  const countedWalnuts = Object.entries(trackedWalnutObject).reduce(
    (a, b) => a + b[1],
    0
  );

  return {
    total: countedWalnuts,
    found: trackedWalnutObject,
  };
}
