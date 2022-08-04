import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";
import { parseMoney } from "../utils/";

describe("Parse Money", () => {
  it("Parses total money earned", () => {
    const money = parseMoney(year3);
    expect(money).toBe(3308007);

    const money2 = parseMoney(new_file);
    expect(money2).toBe(0);

    const money3 = parseMoney(max_file);
    expect(money3).toBe(174911730);
  });
});
