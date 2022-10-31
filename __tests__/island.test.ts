import { parseGingerIsland } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Ginger Island", () => {
  it("Return if the user has been to Ginger Island", () => {
    const { hasVisitedIsland: hasVisitedIslandYear3 } =
      parseGingerIsland(year3);
    const { hasVisitedIsland: hasVisitedIslandNewFile } =
      parseGingerIsland(new_file);
    const { hasVisitedIsland: hasVisitedIslandMaxFile } =
      parseGingerIsland(max_file);

    expect(hasVisitedIslandYear3).toBe(true);
    expect(hasVisitedIslandNewFile).toBe(false);
    expect(hasVisitedIslandMaxFile).toBe(true);
  });

  it("Returns the correct number of journal scraps found", () => {
    const { journalScrapsFound: journalScrapsFoundYear3 } =
      parseGingerIsland(year3);
    const { journalScrapsFound: journalScrapsFoundNewFile } =
      parseGingerIsland(new_file);
    const { journalScrapsFound: journalScrapsFoundMaxFile } =
      parseGingerIsland(max_file);

    expect(journalScrapsFoundYear3).toBe(11);
    expect(journalScrapsFoundNewFile).toBe(0);
    expect(journalScrapsFoundMaxFile).toBe(11);
  });

  it("Returns how many golden walnuts have been found", () => {
    const { goldenWalnutsFound: goldenWalnutsFoundYear3 } =
      parseGingerIsland(year3);
    const { goldenWalnutsFound: goldenWalnutsFoundNewFile } =
      parseGingerIsland(new_file);
    const { goldenWalnutsFound: goldenWalnutsFoundMaxFile } =
      parseGingerIsland(max_file);

    expect(goldenWalnutsFoundYear3).toBe(103);
    expect(goldenWalnutsFoundNewFile).toBe(0);
    expect(goldenWalnutsFoundMaxFile).toBe(130);
  });

  it("Returns the correct number of golden walnuts calculated from the save file", () => {
    const { goldenWalnutsCalculated: goldenWalnutsCalculatedYear3 } =
      parseGingerIsland(year3);
    const { goldenWalnutsCalculated: goldenWalnutsCalculatedNewFile } =
      parseGingerIsland(new_file);
    const { goldenWalnutsCalculated: goldenWalnutsCalculatedMaxFile } =
      parseGingerIsland(max_file);

    expect(goldenWalnutsCalculatedYear3).toBe(102);
    expect(goldenWalnutsCalculatedNewFile).toBe(0);
    expect(goldenWalnutsCalculatedMaxFile).toBe(130);
  });

  it("Returns a list of walnuts found & their count", () => {
    const { walnutsFound: walnutsFoundYear3 } = parseGingerIsland(year3);
    const { walnutsFound: walnutsFoundNewFile } = parseGingerIsland(new_file);
    const { walnutsFound: walnutsFoundMaxFile } = parseGingerIsland(max_file);

    expect(walnutsFoundYear3).toEqual({
      Bush_IslandEast_17_37: 1,
      Bush_IslandShrine_23_34: 1,
      Bush_IslandSouth_31_5: 1,
      Bush_IslandNorth_9_84: 1,
      Bush_IslandNorth_20_26: 1,
      Bush_IslandNorth_56_27: 1,
      Bush_IslandNorth_4_42: 1,
      Bush_IslandNorth_45_38: 1,
      Bush_IslandNorth_47_40: 1,
      Bush_IslandNorth_13_33: 1,
      Bush_IslandNorth_5_30: 1,
      Bush_Caldera_28_36: 1,
      Bush_Caldera_9_34: 1,
      Bush_CaptainRoom_2_4: 1,
      TreeNut: 1,
      Buried_IslandNorth_19_39: 1,
      Buried_IslandNorth_19_13: 1,
      Buried_IslandNorth_57_79: 1,
      Buried_IslandNorth_54_21: 1,
      Buried_IslandNorth_42_77: 1,
      Buried_IslandNorth_62_54: 1,
      Buried_IslandNorth_26_81: 1,
      IslandLeftPlantRestored: 1,
      IslandRightPlantRestored: 1,
      IslandBatRestored: 1,
      IslandFrogRestored: 1,
      IslandCenterSkeletonRestored: 0,
      IslandSnakeRestored: 0,
      Bush_IslandWest_104_3: 1,
      Bush_IslandWest_31_24: 1,
      Bush_IslandWest_38_56: 1,
      Bush_IslandWest_75_29: 1,
      Bush_IslandWest_64_30: 1,
      Bush_IslandWest_54_18: 1,
      Bush_IslandWest_25_30: 1,
      Bush_IslandWest_15_3: 1,
      Buried_IslandWest_21_81: 1,
      Buried_IslandWest_62_76: 1,
      Buried_IslandWest_39_24: 1,
      Buried_IslandWest_88_14: 1,
      Buried_IslandWest_43_74: 1,
      Buried_IslandWest_30_75: 1,
      IslandWestCavePuzzle: 3,
      SandDuggy: 1,
      TreeNutShot: 1,
      Mermaid: 0,
      Buried_IslandSouthEastCave_36_26: 1,
      Buried_IslandSouthEast_25_17: 1,
      StardropPool: 1,
      BananaShrine: 3,
      IslandGourmand1: 5,
      IslandGourmand2: 0,
      IslandGourmand3: 0,
      IslandShrinePuzzle: 5,
      GoldenCoconut: 1,
      Birdie: 5,
      Darts: 0,
      TigerSlimeNut: 1,
      VolcanoNormalChest: 1,
      VolcanoRareChest: 1,
      VolcanoBarrel: 4,
      VolcanoMining: 5,
      VolcanoMonsterDrop: 5,
      IslandFarming: 5,
      MusselStone: 5,
      IslandFishing: 5,
      Island_N_BuriedTreasureNut: 1,
      Island_W_BuriedTreasureNut: 1,
      Island_W_BuriedTreasureNut2: 1,
    });
    expect(walnutsFoundNewFile).toEqual({
      Bush_IslandEast_17_37: 0,
      Bush_IslandShrine_23_34: 0,
      Bush_IslandSouth_31_5: 0,
      Bush_IslandNorth_9_84: 0,
      Bush_IslandNorth_20_26: 0,
      Bush_IslandNorth_56_27: 0,
      Bush_IslandNorth_4_42: 0,
      Bush_IslandNorth_45_38: 0,
      Bush_IslandNorth_47_40: 0,
      Bush_IslandNorth_13_33: 0,
      Bush_IslandNorth_5_30: 0,
      Bush_Caldera_28_36: 0,
      Bush_Caldera_9_34: 0,
      Bush_CaptainRoom_2_4: 0,
      TreeNut: 0,
      Buried_IslandNorth_19_39: 0,
      Buried_IslandNorth_19_13: 0,
      Buried_IslandNorth_57_79: 0,
      Buried_IslandNorth_54_21: 0,
      Buried_IslandNorth_42_77: 0,
      Buried_IslandNorth_62_54: 0,
      Buried_IslandNorth_26_81: 0,
      IslandLeftPlantRestored: 0,
      IslandRightPlantRestored: 0,
      IslandBatRestored: 0,
      IslandFrogRestored: 0,
      IslandCenterSkeletonRestored: 0,
      IslandSnakeRestored: 0,
      Bush_IslandWest_104_3: 0,
      Bush_IslandWest_31_24: 0,
      Bush_IslandWest_38_56: 0,
      Bush_IslandWest_75_29: 0,
      Bush_IslandWest_64_30: 0,
      Bush_IslandWest_54_18: 0,
      Bush_IslandWest_25_30: 0,
      Bush_IslandWest_15_3: 0,
      Buried_IslandWest_21_81: 0,
      Buried_IslandWest_62_76: 0,
      Buried_IslandWest_39_24: 0,
      Buried_IslandWest_88_14: 0,
      Buried_IslandWest_43_74: 0,
      Buried_IslandWest_30_75: 0,
      IslandWestCavePuzzle: 0,
      SandDuggy: 0,
      TreeNutShot: 0,
      Mermaid: 0,
      Buried_IslandSouthEastCave_36_26: 0,
      Buried_IslandSouthEast_25_17: 0,
      StardropPool: 0,
      BananaShrine: 0,
      IslandGourmand1: 0,
      IslandGourmand2: 0,
      IslandGourmand3: 0,
      IslandShrinePuzzle: 0,
      GoldenCoconut: 0,
      Birdie: 0,
      Darts: 0,
      TigerSlimeNut: 0,
      VolcanoNormalChest: 0,
      VolcanoRareChest: 0,
      VolcanoBarrel: 0,
      VolcanoMining: 0,
      VolcanoMonsterDrop: 0,
      IslandFarming: 0,
      MusselStone: 0,
      IslandFishing: 0,
      Island_N_BuriedTreasureNut: 0,
      Island_W_BuriedTreasureNut: 0,
      Island_W_BuriedTreasureNut2: 0,
    });
    expect(walnutsFoundMaxFile).toEqual({
      Bush_IslandEast_17_37: 1,
      Bush_IslandShrine_23_34: 1,
      Bush_IslandSouth_31_5: 1,
      Bush_IslandNorth_9_84: 1,
      Bush_IslandNorth_20_26: 1,
      Bush_IslandNorth_56_27: 1,
      Bush_IslandNorth_4_42: 1,
      Bush_IslandNorth_45_38: 1,
      Bush_IslandNorth_47_40: 1,
      Bush_IslandNorth_13_33: 1,
      Bush_IslandNorth_5_30: 1,
      Bush_Caldera_28_36: 1,
      Bush_Caldera_9_34: 1,
      Bush_CaptainRoom_2_4: 1,
      TreeNut: 1,
      Buried_IslandNorth_19_39: 1,
      Buried_IslandNorth_19_13: 1,
      Buried_IslandNorth_57_79: 1,
      Buried_IslandNorth_54_21: 1,
      Buried_IslandNorth_42_77: 1,
      Buried_IslandNorth_62_54: 1,
      Buried_IslandNorth_26_81: 1,
      IslandLeftPlantRestored: 1,
      IslandRightPlantRestored: 1,
      IslandBatRestored: 1,
      IslandFrogRestored: 1,
      IslandCenterSkeletonRestored: 6,
      IslandSnakeRestored: 3,
      Bush_IslandWest_104_3: 1,
      Bush_IslandWest_31_24: 1,
      Bush_IslandWest_38_56: 1,
      Bush_IslandWest_75_29: 1,
      Bush_IslandWest_64_30: 1,
      Bush_IslandWest_54_18: 1,
      Bush_IslandWest_25_30: 1,
      Bush_IslandWest_15_3: 1,
      Buried_IslandWest_21_81: 1,
      Buried_IslandWest_62_76: 1,
      Buried_IslandWest_39_24: 1,
      Buried_IslandWest_88_14: 1,
      Buried_IslandWest_43_74: 1,
      Buried_IslandWest_30_75: 1,
      IslandWestCavePuzzle: 3,
      SandDuggy: 1,
      TreeNutShot: 1,
      Mermaid: 5,
      Buried_IslandSouthEastCave_36_26: 1,
      Buried_IslandSouthEast_25_17: 1,
      StardropPool: 1,
      BananaShrine: 3,
      IslandGourmand1: 5,
      IslandGourmand2: 5,
      IslandGourmand3: 5,
      IslandShrinePuzzle: 5,
      GoldenCoconut: 1,
      Birdie: 5,
      Darts: 3,
      TigerSlimeNut: 1,
      VolcanoNormalChest: 1,
      VolcanoRareChest: 1,
      VolcanoBarrel: 5,
      VolcanoMining: 5,
      VolcanoMonsterDrop: 5,
      IslandFarming: 5,
      MusselStone: 5,
      IslandFishing: 5,
      Island_N_BuriedTreasureNut: 1,
      Island_W_BuriedTreasureNut: 1,
      Island_W_BuriedTreasureNut2: 1,
    });
  });
});
