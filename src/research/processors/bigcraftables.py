# We need the big craftable information because the big craftable itemIDs are different from the itemIDs in objects
# https://stardewvalleywiki.com/Modding:Items#Big_craftables

import json
import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

with open("../raw_data/BigCraftablesInformation.json", "r") as f:
    data = json.load(f)

with open("../raw_data/CraftingRecipes.json", "r") as f:
    crafting_recipes = json.load(f)

# loop through crafting recipes and get a list of yield itemIDs
# that way we only have to look those up BigCraftablesInformation.json
itemIDs = []
for value in crafting_recipes.values():
    fields = value.split("/")
    itemID = fields[2].split(" ")[0]  # yield is "itemID amount"
    is_big_craftable = fields[3] == "true"
    if is_big_craftable:
        itemIDs.append(itemID)

# recreate objects.json but for big craftables
big_craftables = {}
for itemID in tqdm(itemIDs):
    fields = data[itemID].split("/")

    name = fields[0]
    description = fields[4]

    # scrape the Stardew Valley Wiki for the image URL
    wiki_url = f"https://stardewvalleywiki.com/File:{name}.png"
    page = requests.get(wiki_url)
    soup = BeautifulSoup(page.text, "html.parser")

    iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]

    big_craftables[itemID] = {
        "name": name,
        "description": description,
        "iconURL": iconURL,
    }

with open("../../data/big_craftables.json", "w") as f:
    json.dump(big_craftables, f, separators=(",", ":"), sort_keys=True)
