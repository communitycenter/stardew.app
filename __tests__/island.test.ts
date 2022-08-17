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
});
