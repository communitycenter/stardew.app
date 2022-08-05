import { parseSocial } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Social", () => {
  it("Returns a list of friendship points for every NPC and the number of 5 and 10 heart relationships", () => {
    const { fiveHeartCount, tenHeartCount, relationships } = parseSocial(year3);
    expect(fiveHeartCount).toBe(33);
    expect(tenHeartCount).toBe(22);
    expect(Object.keys(relationships).length).toBe(35);

    const {
      fiveHeartCount: fhc1,
      tenHeartCount: thc1,
      relationships: r1,
    } = parseSocial(new_file);
    expect(fhc1).toBe(0);
    expect(thc1).toBe(0);
    expect(r1["Robin"].status).toBe("Friendly");
    expect(r1["Haley"].status).toBe("Stranger");

    const {
      fiveHeartCount: fhc2,
      tenHeartCount: thc2,
      relationships: r2,
    } = parseSocial(max_file);
    expect(fhc2).toBe(36);
    expect(thc2).toBe(24);
    expect(Object.keys(r2).length).toBe(37);
  });
});
