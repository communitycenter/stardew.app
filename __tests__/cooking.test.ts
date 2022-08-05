import { parseCooking } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Cooking", () => {
  it("Returns how many recipes the player has cooked and which recipes are left to find and cook", () => {
    const {
      allRecipesCount,
      knownRecipesCount,
      cookedRecipesCount,
      uncookedRecipes,
      unknownRecipes,
    } = parseCooking(year3);
    expect(allRecipesCount).toBe(80);
    expect(knownRecipesCount).toBe(73);
    expect(cookedRecipesCount).toBe(25);
    expect(uncookedRecipes.size).toBe(knownRecipesCount - cookedRecipesCount);
    expect(unknownRecipes.size).toBe(allRecipesCount - knownRecipesCount);

    const {
      allRecipesCount: arc2,
      knownRecipesCount: krc2,
      cookedRecipesCount: crc2,
      uncookedRecipes: unc2,
      unknownRecipes: unk2,
    } = parseCooking(new_file);
    expect(arc2).toBe(80);
    expect(krc2).toBe(1);
    expect(crc2).toBe(0);
    expect(unc2.size).toBe(krc2 - crc2);
    expect(unk2.size).toBe(arc2 - krc2);

    const {
      allRecipesCount: arc3,
      knownRecipesCount: krc3,
      cookedRecipesCount: crc3,
      uncookedRecipes: unc3,
      unknownRecipes: unk3,
    } = parseCooking(max_file);
    expect(arc3).toBe(80);
    expect(krc3).toBe(80);
    expect(crc3).toBe(80);
    expect(unc3.size).toBe(0);
    expect(unk3.size).toBe(0);
  });
});
