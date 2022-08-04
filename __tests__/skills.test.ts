import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max from "./SaveFiles/max.json";
import { parseSkills } from "../utils/";

describe("Parse Skills", () => {
  it("Parses Player Level and Skill Levels", () => {
    const { levels, maxLevelCount } = parseSkills(year3);
    expect(levels).toEqual({
      Player: 25,
      Farming: 10,
      Fishing: 10,
      Foraging: 10,
      Mining: 10,
      Combat: 10,
      Luck: 0,
    });
    expect(maxLevelCount).toBe(5);

    const { levels: levels2, maxLevelCount: maxLevelCount2 } =
      parseSkills(new_file);
    expect(levels2).toEqual({
      Player: 0,
      Farming: 0,
      Fishing: 0,
      Foraging: 0,
      Mining: 0,
      Combat: 0,
      Luck: 0,
    });
    expect(maxLevelCount2).toBe(0);

    const { levels: levels3, maxLevelCount: maxLevelCount3 } = parseSkills(max);
    expect(levels3).toEqual({
      Player: 25,
      Farming: 10,
      Fishing: 10,
      Foraging: 10,
      Mining: 10,
      Combat: 10,
      Luck: 0,
    });
    expect(maxLevelCount3).toBe(5);
  });
});
