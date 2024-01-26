# Purpose: Processing big craftables information since it is separate from objects
#          from Content/BigCraftables and scraping image URLs from the wiki
# Result is saved to data/big_craftables.json
# { itemID: { name, description, iconURL } }

import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

from helpers.models import BigObject, ContentBigObjectModel
from helpers.utils import save_json, load_content, load_strings, get_string

# load the content files
BIG_OBJECTS: dict[str, ContentBigObjectModel] = load_content("BigCraftables.json")
BIG_OBJ_STRINGS = load_strings("BigCraftables.json")
RECIPES: dict[str, str] = load_content("CraftingRecipes.json")

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

output: dict[str, BigObject] = {}
for itemID in tqdm(yieldIDs):
    value = BIG_OBJECTS[itemID]

    name = get_string(value["DisplayName"], BIG_OBJ_STRINGS)
    description = get_string(value["Description"], BIG_OBJ_STRINGS)

    # scrape the Stardew Valley Wiki for the image URL
    wiki_url = f"https://stardewvalleywiki.com/File:{name}.png"
    page = requests.get(wiki_url)
    soup = BeautifulSoup(page.text, "html.parser")

    iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]

    output[itemID] = {
        "name": name,
        "description": description,
        "iconURL": f"https://stardewvalleywiki.com{iconURL}",
    }

assert len(output) == 49
save_json(output, "big_craftables.json", sort=True)
