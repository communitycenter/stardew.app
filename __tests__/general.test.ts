import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";
import { parseGeneral } from "../utils/";

describe("Parse General Information", () => {
  it("Parses General Information like name, farm name, and time played", () => {
    const { name, farmInfo, timePlayed } = parseGeneral(year3);
    expect(name).toBe("clem");
    expect(farmInfo).toBe("No Onion Farm (Four Corners)");
    expect(timePlayed).toBe("74h 42m");

    const {
      name: name2,
      farmInfo: farmInfo2,
      timePlayed: timePlayed2,
    } = parseGeneral(new_file);
    expect(name2).toBe("newfile");
    expect(farmInfo2).toBe("new Farm (Standard)");
    expect(timePlayed2).toBe("0h 0m");
  });

  const {
    name: name3,
    farmInfo: farmInfo3,
    timePlayed: timePlayed3,
  } = parseGeneral(max_file);
  expect(name3).toBe("yusuf");
  expect(farmInfo3).toBe("riverland Farm (Riverland)");
});
