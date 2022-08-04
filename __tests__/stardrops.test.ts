import { parseStardrops } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

const STARDROPS = {
  CF_Fair: "Can be purchased at the Stardew Valley Fair for 2,000 star tokens.",
  CF_Fish:
    "Received in mail from Willy after completing the Master Angler Achievement.",
  CF_Mines: "Obtained from the treasure chest on floor 100 in The Mines.",
  CF_Sewer: "Can be purchased from Krobus for 20,000g in The Sewers.",
  CF_Spouse:
    "Obtained from spouse after reaching a friendship level of 12.5 hearts.",
  CF_Statue:
    "Obtained from Old Master Cannoli in the Secret Woods after giving him a Sweet Gem Berry.",
  museumComplete: "Reward for donating all 95 items to the Museum.",
};

describe("Parse Stardrops", () => {
  it("Parses Stardrops Collected and Returns a list of needed stardrops to collect.", () => {
    const { stardropsCount, stardropsNeeded } = parseStardrops(year3);
    expect(stardropsCount).toBe(5);
    expect(stardropsNeeded).toEqual([
      STARDROPS["CF_Fish"],
      STARDROPS["museumComplete"],
    ]);

    const {
      stardropsCount: stardropsCount2,
      stardropsNeeded: stardropsNeeded2,
    } = parseStardrops(new_file);
    expect(stardropsCount2).toBe(0);
    expect(stardropsNeeded2).toEqual(Object.values(STARDROPS));

    const {
      stardropsCount: stardropsCount3,
      stardropsNeeded: stardropsNeeded3,
    } = parseStardrops(max_file);
    expect(stardropsCount3).toBe(7);
    expect(stardropsNeeded3).toBeUndefined();
  });
});
