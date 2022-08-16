# Parsing all big craftables to use in crafting page
# https://stardewvalleywiki.com/Modding:Items#Data_format_2

import json
import bs4
import requests

big_craftables = {}

with open("../raw_data/BigCraftablesInformation.json", "r") as file:
    rawInfo = json.load(file)

with open("./data/crafting_recipes.json", "r") as file:
    craftingRecipes = json.load(file)

# for now, we'll only add the big craftables needed for the achievement since
# i'm too lazy to try and deal with duplicate names
itemIDs = []
for key in craftingRecipes:
    if craftingRecipes[key]["bigCraftable"] == True:
        itemIDs.append(key)

# 167 entries
for itemID in itemIDs:
    fields = rawInfo["content"][itemID].split("/")

    name = fields[0]
    description = fields[4]

    # scrape for iconURL
    wiki_url = f"https://stardewvalleywiki.com/File:{name}.png"
    r = requests.get(wiki_url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]

    big_craftables[itemID] = {
        "name": name,
        "itemID": int(itemID),
        "iconURL": "https://stardewvalleywiki.com" + iconURL,
        "description": description,
    }

with open("./data/big_craftables.json", "w") as file:
    json.dump(big_craftables, file, indent=4)
