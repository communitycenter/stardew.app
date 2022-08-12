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
    const { stardropsCount, stardrops } = parseStardrops(year3);
    expect(stardropsCount).toBe(5);
    expect(stardrops).toEqual({
      CF_Fair: true,
      CF_Fish: false,
      CF_Mines: true,
      CF_Sewer: true,
      CF_Spouse: true,
      CF_Statue: true,
      museumComplete: false,
    });

    const { stardropsCount: stardropsCount2, stardrops: stardrops2 } =
      parseStardrops(new_file);
    expect(stardropsCount2).toBe(0);
    expect(stardrops2).toEqual({
      CF_Fair: false,
      CF_Fish: false,
      CF_Mines: false,
      CF_Sewer: false,
      CF_Spouse: false,
      CF_Statue: false,
      museumComplete: false,
    });

    const { stardropsCount: stardropsCount3, stardrops: stardrops3 } =
      parseStardrops(max_file);
    expect(stardropsCount3).toBe(7);
    expect(stardrops3).toEqual({
      CF_Fair: true,
      CF_Fish: true,
      CF_Mines: true,
      CF_Sewer: true,
      CF_Spouse: true,
      CF_Statue: true,
      museumComplete: true,
    });
  });
});
