import { parseShipping } from "../utils";
import year3 from "./SaveFiles/year3.json";
import new_file from "./SaveFiles/new.json";
import max_file from "./SaveFiles/max.json";

describe("Parse Full Shipment", () => {
  it("Returns an object with all items from the Collections tab and how many they've shipped", () => {
    const { itemsShipped, numItems } = parseShipping(year3);
    expect(Object.keys(itemsShipped).length).toBe(145);
    expect(numItems).toBe(137);

    const { itemsShipped: is2, numItems: ni2 } = parseShipping(new_file);
    expect(Object.keys(is2).length).toBe(145);
    expect(ni2).toBe(0);

    const { itemsShipped: is3, numItems: ni3 } = parseShipping(max_file);
    expect(Object.keys(is3).length).toBe(145);
    expect(ni3).toBe(145);
  });
});
