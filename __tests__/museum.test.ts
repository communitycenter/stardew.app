import { parseMuseum } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Museum Collection", () => {
  it("Returns an object with artifacts and minerals and a boolean value for donated or not.", () => {
    const { artifacts, minerals } = parseMuseum(year3);
    expect(Object.keys(artifacts).length).toBe(42);
    expect(Object.keys(minerals).length).toBe(53);
    let artifactCount = 0;
    for (const idx in artifacts) {
      if (artifacts[idx]) artifactCount++;
    }
    expect(artifactCount).toBe(36);
    let mineralCount = 0;
    for (const idx in minerals) {
      if (minerals[idx]) mineralCount++;
    }
    expect(mineralCount).toBe(52);

    const { artifacts: artifacts2, minerals: minerals2 } =
      parseMuseum(new_file);
    expect(Object.keys(artifacts2).length).toBe(42);
    expect(Object.keys(minerals2).length).toBe(53);
    let artifactCount2 = 0;
    for (const idx in artifacts2) {
      if (artifacts2[idx]) artifactCount2++;
    }
    expect(artifactCount2).toBe(0);
    let mineralCount2 = 0;
    for (const idx in minerals2) {
      if (minerals2[idx]) mineralCount2++;
    }
    expect(mineralCount2).toBe(0);

    const { artifacts: artifacts3, minerals: minerals3 } =
      parseMuseum(max_file);
    expect(Object.keys(artifacts3).length).toBe(42);
    expect(Object.keys(minerals3).length).toBe(53);
    let artifactCount3 = 0;
    for (const idx in artifacts3) {
      if (artifacts3[idx]) artifactCount3++;
    }
    expect(artifactCount3).toBe(42);
    let mineralCount3 = 0;
    for (const idx in minerals3) {
      if (minerals3[idx]) mineralCount3++;
    }
    expect(mineralCount3).toBe(53);
  });
});
