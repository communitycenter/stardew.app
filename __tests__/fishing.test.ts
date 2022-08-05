import { parseFishing } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Fish", () => {
  it("Returns an object with all fish IDs and which ones have been caught + total number caught", () => {
    const { totalFishCaught, fishCaught } = parseFishing(year3);
    expect(totalFishCaught).toBe(1043);
    expect(fishCaught["151"]).toBeTruthy();
    expect(fishCaught["269"]).toBeFalsy();
    expect(Object.keys(fishCaught).length).toBe(67);

    const { totalFishCaught: tfc2, fishCaught: fc2 } = parseFishing(new_file);
    expect(tfc2).toBe(0);
    expect(fc2["151"]).toBeFalsy();
    expect(fc2["269"]).toBeFalsy();
    expect(Object.keys(fc2).length).toBe(67);

    const { totalFishCaught: tfc3, fishCaught: fc3 } = parseFishing(max_file);
    expect(tfc3).toBe(1563);
    expect(fc3["151"]).toBeTruthy();
    expect(fc3["269"]).toBeTruthy();
    expect(Object.keys(fc3).length).toBe(67);
  });
});
