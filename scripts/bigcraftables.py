# Purpose: Processing big craftables information since it is separate from objects
#          from Content/BigCraftables and scraping image URLs from the wiki
# Result is saved to data/big_craftables.json
# { itemID: { name, description, iconURL, minVersion } }
#
# Content Files used: BigCraftables.json, Strings/BigCraftables.json, Strings/1_6_Strings.json, CraftingRecipes.json
# Wiki Pages used: None

import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

from helpers.models import BigObject, ContentBigObjectModel
from helpers.utils import save_json, load_content, load_strings, get_string

# load the content files

BIG_OBJECTS: dict[str, ContentBigObjectModel] = load_content("BigCraftables.json")
BIG_OBJ_STRINGS = load_strings("BigCraftables.json")
STRINGS_1_6 = load_strings("1_6_Strings.json")
RECIPES: dict[str, str] = load_content("CraftingRecipes.json")

# alpha didn't include new content so we can use it to flag new content
ALPHA_BO: dict[str, ContentBigObjectModel] = load_content(
    "BigCraftables.json", "1.6 alpha"
)


def get_yields() -> list[str]:
    # Go through all the crafting recipes and get a list of their yield itemIDs
    # since we are only interested in big craftables for achievements.
    # More info on crafting recipes: https://stardewvalleywiki.com/Modding:Recipe_data#Crafting_recipes
    yieldIDs = []
    for value in RECIPES.values():
        fields = value.split("/")
        itemID = fields[2].split(" ")[0]  # yield is "itemID amount"
        is_big_craftable = fields[3] == "true"
        if is_big_craftable:
            yieldIDs.append(itemID)

    return yieldIDs


def get_bigcraftables() -> dict[str, BigObject]:
    yieldIDs = get_yields()

    output: dict[str, BigObject] = {}
    for itemID in tqdm(yieldIDs):
        value = BIG_OBJECTS[itemID]

        name = get_string(value["DisplayName"])
        description = get_string(value["Description"])

        minVersion = "1.5.0" if itemID in ALPHA_BO else "1.6.0"

        # scrape the Stardew Valley Wiki for the image URL
        wiki_url = f"https://stardewvalleywiki.com/File:{name}.png"
        page = requests.get(wiki_url)
        soup = BeautifulSoup(page.text, "html.parser")

        if minVersion == "1.5.0":
            iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]
            iconURL = f"https://stardewvalleywiki.com{iconURL}"
        else:
            iconURL = None

        output[itemID] = {
            "description": description,
            "iconURL": iconURL,
            "minVersion": minVersion,
            "name": name,
        }

    return output


if __name__ == "__main__":
    output = get_bigcraftables()

    # assert len(output) == 49 # as of 1.5.6

    # content_unpacked repo, new_items.py reports 13 new big craftables
    assert len([i for i in output if output[i]["minVersion"] == "1.6.0"]) == 13

    save_json(output, "big_craftables.json", sort=True)
