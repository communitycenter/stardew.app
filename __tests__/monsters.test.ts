import { parseMonsters } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Monsters", () => {
  it("Returns how many monsters per category were killed and what monster slayer goals are left", () => {
    const { deepestMineLevel, deepestSkullCavernLevel, monstersKilled } =
      parseMonsters(year3);
    expect(deepestMineLevel).toBe(120);
    expect(deepestSkullCavernLevel).toBe(101);
    expect(monstersKilled).toEqual({
      slimes: 620,
      "void spirits": 69,
      bats: 94,
      skeletons: 15,
      "cave insects": 104,
      duggies: 6,
      "dust sprites": 63,
      "rock crabs": 19,
      mummies: 0,
      "pepper rex": 19,
      serpents: 146,
      "magma sprites": 107,
    });

    const {
      deepestMineLevel: dml2,
      deepestSkullCavernLevel: dscl2,
      monstersKilled: mk2,
    } = parseMonsters(new_file);
    expect(dml2).toBe(0);
    expect(dscl2).toBe(0);
    expect(mk2).toEqual({
      slimes: 0,
      "void spirits": 0,
      bats: 0,
      skeletons: 0,
      "cave insects": 0,
      duggies: 0,
      "dust sprites": 0,
      "rock crabs": 0,
      mummies: 0,
      "pepper rex": 0,
      serpents: 0,
      "magma sprites": 0,
    });

    const {
      deepestMineLevel: dml3,
      deepestSkullCavernLevel: dscl3,
      monstersKilled: mk3,
    } = parseMonsters(max_file);
    expect(dml3).toBe(120);
    expect(dscl3).toBe(357);
    expect(mk3).toEqual({
      slimes: 1041,
      "void spirits": 155,
      bats: 416,
      skeletons: 55,
      "cave insects": 408,
      duggies: 34,
      "dust sprites": 500,
      "rock crabs": 68,
      mummies: 104,
      "pepper rex": 52,
      serpents: 273,
      "magma sprites": 151,
    });
  });
});
