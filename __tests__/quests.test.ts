import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max from "./SaveFiles/max.json";
import { parseQuests } from "../utils";

describe("Parse Quests", () => {
  it("Parses # of Quests Completed", () => {
    const questsCompleted = parseQuests(year3);
    expect(questsCompleted).toBe(40);

    const questsCompleted2 = parseQuests(new_file);
    expect(questsCompleted2).toBe(0);

    const questsCompleted3 = parseQuests(max);
    expect(questsCompleted3).toBe(48);
  });
});
