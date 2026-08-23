# Purpose: parse FruitTrees.json for which fruit each tree grows, keyed by tree ID
# Result is saved to data/fruit_trees.json
#
# Content Files used: FruitTrees.json
# Data Files used: objects.json

from tqdm import tqdm

from helpers.models import FruitTree
from helpers.utils import load_content, load_data, save_json

TREES: dict[str, dict] = load_content("FruitTrees.json")
OBJECTS: dict[str, dict] = load_data("objects.json")


def get_fruit_trees() -> dict[str, FruitTree]:
    output: dict[str, FruitTree] = {}
    for key, value in tqdm(TREES.items()):
        fruit = value.get("Fruit") or []
        fruit_id = fruit[0]["ItemId"] if fruit else ""
        if fruit_id.startswith("(O)"):
            fruit_id = fruit_id[3:]

        output[key] = {
            "name": OBJECTS.get(fruit_id, {}).get("name", fruit_id),
            "fruitId": fruit_id,
        }

    return output


if __name__ == "__main__":
    output = get_fruit_trees()
    save_json(output, "fruit_trees.json", sort=True)
