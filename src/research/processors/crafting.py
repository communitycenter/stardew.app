# Parse all crafting recipe info from game files
# https://stardewvalleywiki.com/Modding:Recipe_data

import re
import json
import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

with open("../raw_data/CraftingRecipes.json", "r") as f:
    data = json.load(f)

with open("../../data/big_craftables.json", "r") as f:
    big_craftables = json.load(f)

with open("../../data/objects.json", "r") as f:
    objects = json.load(f)

# only two used in recipes, look for negative numbers in CraftingRecipes.json
# -\d+ matches any negative number
categories = {"-4": "Any Fish", "-777": "Wild Seeds (any)"}

skills = set(["Farming", "Fishing", "Foraging", "Mining", "Combat", "Luck"])

# we hardcoding these because they're easier to find out than the rest of null values
# list comes from https://stardewvalleywiki.com/Modding:Recipe_data#Exceptions
# In the game code, these are set in StardewValley.Farmer.cs::farmerInit()
defaults = set(
    [
        "Chest",
        "Wood Fence",
        "Gate",
        "Torch",
        "Campfire",
        "Wood Path",
        "Cobblestone Path",
        "Gravel Path",
        "Wood Sign",
        "Stone Sign",
    ]
)

duplicates = []
unknowns = []
translations = {}
recipes = {}
# key = recipe name, value = recipe data
for key, value in tqdm(data.items()):
    # recipes that don't count for achievements (currently only one as of 1.5)
    # look at StardewValley.Stats::checkForCraftingAchievements()
    if key == "Wedding Ring":
        continue

    fields = value.split("/")
    itemID = fields[2].split(" ")[0]  # yield is "itemID amount"
    is_big_craftable = fields[3] == "true"

    if is_big_craftable:
        name = big_craftables[itemID]["name"]
    else:
        name = objects[itemID]["name"]

    if key != name:
        translations[key] = name

    ingredients = []
    ingr = fields[0]
    i = iter(ingr.split(" "))
    pairs = map(" ".join, zip(i, i))
    for pair in pairs:
        item_id, quantity = pair.split(" ")
        ingredients.append({"itemID": int(item_id), "quantity": int(quantity)})

    unlockConditions = fields[4].split(" ")
    if unlockConditions[0] in skills:
        skill = unlockConditions[0]
        level = unlockConditions[1]
        unlockConditions = f"Reach level {level} in {skill} skill."
    elif unlockConditions[0] == "s":
        skill = unlockConditions[1]
        level = unlockConditions[2]
        unlockConditions = f"Reach level {level} in {skill} skill."
    elif unlockConditions[0] == "l":
        if unlockConditions[1] == "0":
            unlockConditions = "Unknown"
        else:
            unlockConditions = f"Reach farmer level {unlockConditions[1]}."
    elif unlockConditions[0] == "f":
        npc = unlockConditions[1]
        hearts = unlockConditions[2]
        unlockConditions = f"Reach {hearts} hearts with {npc}."
    elif unlockConditions[0] == "null":
        unlockConditions = "Unknown"

    if name in defaults:
        unlockConditions = "Starter Recipe - no steps required!"

    # scrape the wiki for the unlock conditions if unknown
    if unlockConditions == "Unknown":
        wiki_url = f"https://stardewvalleywiki.com/{name}"
        page = requests.get(wiki_url)
        soup = BeautifulSoup(page.text, "html.parser")

        # try and find the row header for the recipe
        elem = soup.find("td", string=re.compile("Recipe Source"))

        if not elem:
            unknowns.append(name)
            continue

        unlockConditions = elem.find_next("td").get_text().strip()

        # hardcoded way to clean up the string but i don't know another way
        # pretty special cases so idk if theres a way to generalize
        if unlockConditions.startswith("Qi's"):
            unlockConditions = unlockConditions.replace("  ", " ")
            if unlockConditions.endswith(")"):
                unlockConditions = unlockConditions.replace(" ( 20)", "for 20 Qi Gems")
            else:
                unlockConditions = unlockConditions + " Qi Gems"

    if f"{itemID}" not in recipes:
        recipes[f"{itemID}"] = {
            "itemID": int(itemID),
            "ingredients": ingredients,
            "unlockConditions": unlockConditions,
            "isBigCraftable": is_big_craftable,
        }
    else:
        duplicates.append((name, itemID))

with open("../../data/crafting.json", "w") as f:
    json.dump(recipes, f, separators=(",", ":"), sort_keys=True)

print("Unknowns:")
if len(unknowns) > 0:
    for u in unknowns:
        print(u)
else:
    print("None")
print("Translations:")
print(json.dumps(translations, indent=2))
print("Duplicates:")
print(json.dumps(duplicates, indent=2))
