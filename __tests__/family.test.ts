import { parseFamily } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Family", () => {
  it("Returns the family's house upgrade level, spouse, and children", () => {
    const { houseUpgradeLevel, spouse, children } = parseFamily(year3);
    expect(houseUpgradeLevel).toBe(3);
    expect(spouse).toBe("Haley");
    expect(children).toEqual(["little clem"]);

    const {
      houseUpgradeLevel: hul2,
      spouse: sp2,
      children: ch2,
    } = parseFamily(new_file);
    expect(hul2).toBe(0);
    expect(sp2).toBeUndefined();
    expect(ch2).toBeUndefined();

    const {
      houseUpgradeLevel: hul3,
      spouse: sp3,
      children: ch3,
    } = parseFamily(max_file);
    expect(hul3).toBe(3);
    expect(sp3).toBeUndefined();
    expect(ch3).toEqual(["Yusuf", "Yusuf1"]);
  });
});
