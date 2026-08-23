# Purpose: parse Crops.json for crop growth and yield data, keyed by harvest item ID
# Result is saved to data/crops.json
#
# Content Files used: Crops.json
# Data Files used: objects.json

from tqdm import tqdm

from helpers.models import Crop
from helpers.utils import load_content, load_data, save_json

CROPS: dict[str, dict] = load_content("Crops.json")
OBJECTS: dict[str, dict] = load_data("objects.json")


def get_crops() -> dict[str, Crop]:
    output: dict[str, Crop] = {}
    for seed_id, value in tqdm(CROPS.items()):
        harvest_id = str(value["HarvestItemId"])
        if harvest_id in output:
            continue

        obj = OBJECTS.get(harvest_id)
        name = obj["name"] if obj else harvest_id

        min_harvest = value.get("HarvestMinStack", 1)

        output[harvest_id] = {
            "name": name,
            "seedId": seed_id,
            "growthDays": sum(value["DaysInPhase"]),
            "regrowDays": value.get("RegrowDays", -1),
            "minHarvest": min_harvest,
            # per Crop.harvest, the max is never below the min
            "maxHarvest": max(min_harvest, value.get("HarvestMaxStack", 1)),
            "extraHarvestChance": value.get("ExtraHarvestChance", 0.0),
        }

    return output


if __name__ == "__main__":
    output = get_crops()
    save_json(output, "crops.json", sort=True)
