# Purpose: to parse Objects.json from the content folder and keep relevant information
# Parsed JSON will be saved to src/data/objects.json
# Key: itemID ex: '23' (not the uniqueID)
# Value: name, description, category, iconURL

import os

from tqdm import tqdm

from helpers.models import Object, ContentObjectModel
from helpers.utils import (
    load_content,
    load_strings,
    save_json,
    getCategoryName,
    get_string,
)

# Room for improvement since we don't use a vast majority of things in the game
# could eventually only save the items we use
skip = set(["925", "927", "929", "930"])  # have descriptions but no use or image

# hardcoded checks for strange dolls because their name doesn't include the color
dolls = {
    "126": "Strange Doll (green)",
    "127": "Strange Doll (yellow)",
}

# load the content files
objects: dict[str, ContentObjectModel] = load_content("Objects.json")
sprites: dict[str, str] = load_content("sprites.json")
objects_strings: dict[str, str] = load_strings("Objects.json")
strings: dict[str, str] = load_strings("StringsFromCSFiles.json")

output: dict[str, Object] = {}
for key, value in objects.items():
    if key in skip:
        continue

    item: Object = {}

    if key in dolls:
        item["name"] = dolls[key]
    else:
        item["name"] = get_string(value["DisplayName"], objects_strings)

    item["description"] = get_string(value["Description"], objects_strings)
    item["category"] = getCategoryName(
        Type=value["Type"], Category=value["Category"], StringsFromCSFiles=strings
    )
    item["iconURL"] = sprites.get(key)

    output[key] = item

save_json(output, "objects.json", sort=False)
