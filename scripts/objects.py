# Purpose: to parse Objects.json from the content folder and keep relevant information
# Result is saved to data/objects.json
# { itemID: { name, description, category, iconURL } }
#
# Content Files used: Objects.json, Strings/Objects.json, Strings/StringsFromCSFiles.json
# Wiki Pages used: None

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
OBJECTS: dict[str, ContentObjectModel] = load_content("Objects.json")
SPRITES: dict[str, str] = load_content("sprites.json")
OBJ_STRINGS: dict[str, str] = load_strings("Objects.json")
STRINGS: dict[str, str] = load_strings("StringsFromCSFiles.json")


def get_objects() -> dict[str, Object]:
    output: dict[str, Object] = {}
    for key, value in tqdm(OBJECTS.items()):
        if key in skip:
            continue

        if key in dolls:
            name = dolls[key]
        else:
            name = get_string(value["DisplayName"], OBJ_STRINGS)

        description = get_string(value["Description"], OBJ_STRINGS)
        category = getCategoryName(
            Type=value["Type"], Category=value["Category"], StringsFromCSFiles=STRINGS
        )
        iconURL = SPRITES.get(key)

        output[key] = {
            "category": category,
            "description": description,
            "iconURL": iconURL,
            "name": name,
        }

    return output


if __name__ == "__main__":
    output = get_objects()
    save_json(output, "objects.json", sort=True)
