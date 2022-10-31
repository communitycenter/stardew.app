import { parsePerfection } from "../utils/parsers/perfection";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Perfection parsing", () => {
  it("Returns information about the Grandpa's candle evaluation", () => {
    const { candleCount } = parsePerfection(year3);
    expect(candleCount).toBe(4);

    const { candleCount: candleCount2 } = parsePerfection(new_file);
    expect(candleCount2).toBe(0);

    const { candleCount: candleCount3 } = parsePerfection(max_file);
    expect(candleCount3).toBe(3);
  });
});
