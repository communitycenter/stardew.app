import { parseCrafting } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Crafting", () => {
  it("Returns Information about crafting recipes the player has crafted and needs to craft.", () => {
    const {
      allRecipesCount,
      craftedCount,
      knownCount,
      uncraftedRecipes,
      unknownRecipes,
      allRecipes,
    } = parseCrafting(year3);
    expect(allRecipesCount).toBe(129);
    expect(knownCount).toBe(110);
    expect(craftedCount).toBe(34);
    expect(uncraftedRecipes.size).toBe(knownCount - craftedCount);
    expect(unknownRecipes.size).toBe(allRecipesCount - knownCount);
    expect(Object.keys(allRecipes).length).toBe(allRecipesCount);

    const {
      allRecipesCount: arc2,
      knownCount: krc2,
      craftedCount: crc2,
      uncraftedRecipes: unc2,
      unknownRecipes: unk2,
      allRecipes: all2,
    } = parseCrafting(new_file);
    expect(arc2).toBe(129);
    expect(krc2).toBe(10);
    expect(crc2).toBe(0);
    expect(unc2.size).toBe(krc2 - crc2);
    expect(unk2.size).toBe(arc2 - krc2);
    expect(Object.keys(all2).length).toBe(allRecipesCount);

    const {
      allRecipesCount: arc3,
      knownCount: krc3,
      craftedCount: crc3,
      uncraftedRecipes: unc3,
      unknownRecipes: unk3,
      allRecipes: all3,
    } = parseCrafting(max_file);
    expect(arc3).toBe(129);
    expect(krc3).toBe(129);
    expect(crc3).toBe(129);
    expect(unc3.size).toBe(0);
    expect(unk3.size).toBe(0);
    expect(Object.keys(all3).length).toBe(allRecipesCount);
  });
});
