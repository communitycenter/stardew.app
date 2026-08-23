# Purpose: parse FarmAnimals.json for produce and timing, keyed by animal type
# Result is saved to data/farm_animals.json
#
# Content Files used: FarmAnimals.json

from tqdm import tqdm

from helpers.models import FarmAnimal
from helpers.utils import load_content, save_json

ANIMALS: dict[str, dict] = load_content("FarmAnimals.json")


def get_farm_animals() -> dict[str, FarmAnimal]:
    output: dict[str, FarmAnimal] = {}
    for key, value in tqdm(ANIMALS.items()):
        produce = value.get("ProduceItemIds") or []
        produce_id = produce[0]["ItemId"] if produce else None
        if produce_id and produce_id.startswith("(O)"):
            produce_id = produce_id[3:]

        output[key] = {
            "produceId": produce_id,
            "daysToProduce": value.get("DaysToProduce", 1),
            "daysToMature": value.get("DaysToMature", 0),
            "sellPrice": value.get("SellPrice", 0),
            "house": value.get("House", ""),
        }

    return output


if __name__ == "__main__":
    output = get_farm_animals()
    save_json(output, "farm_animals.json", sort=True)
