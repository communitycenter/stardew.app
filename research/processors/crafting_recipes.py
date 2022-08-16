# Parsing all Crafting Recipes information from game files
# https://stardewvalleywiki.com/Modding:Recipe_data

import json


with open("../raw_data/CraftingRecipes.json", "r") as f:
    rawData = json.load(f)

with open("./data/objects.json", "r") as f:
    objects = json.load(f)

categories = {"-4": "Any Fish", "-777": "Wild Seeds (any)"}

skills = set(["Farming", "Fishing", "Foraging", "Mining", "Combat", "Luck"])

# we hardcoding these because they're easier to find out than the rest of null values
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
craftingRecipes = {}

for recipe_name, value in rawData["content"].items():
    if recipe_name == "Oil Of Garlic":  # only translation needed
        recipe_name = "Oil of Garlic"

    if recipe_name == "Wedding Ring":
        # this crafting recipe is not necessary for the achievements
        continue

    fields = value.split("/")
    materials = []
    # create pairs of materials and counts
    mats = fields[0]
    i = iter(mats.split(" "))
    pairs = map(" ".join, zip(i, i))
    for pair in pairs:
        item_id = pair.split(" ")[0]
        amount = pair.split(" ")[1]

        materials.append({"itemID": int(item_id), "amount": int(amount)})

    itemID = int(fields[2].split(" ")[0])
    bigCraftable = fields[3] == "true"

    unlockConditions = fields[4].split(" ")
    if unlockConditions[0] in skills:
        skill = unlockConditions[0]
        level = unlockConditions[1]
        unlockConditions = f"Reach level {level} in {skill}."
    elif unlockConditions[0] == "s":
        skill = unlockConditions[1]
        level = unlockConditions[2]
        unlockConditions = f"Reach level {level} in {skill}."
    elif unlockConditions[0] == "l":
        if unlockConditions[1] == "0":
            unlockConditions = "default"
        else:
            unlockConditions = f"Reach farmer level {unlockConditions[1]}."
    elif unlockConditions[0] == "f":
        npc = unlockConditions[1]
        hearts = unlockConditions[2]
        unlockConditions = f"Reach {hearts} hearts with {npc}."
    elif unlockConditions[0] == "null":
        if recipe_name in defaults:
            unlockConditions = "default"
        else:
            # TODO: there's actually a lot of these so we need to find a way to
            # find their unlock conditions.
            unlockConditions = "unknown"

    # TODO: have to parse bigcraftables and lookup there
    # iconURL = objects[str(itemID)]["iconURL"]
    # description = objects[str(itemID)]["description"]

    craftingRecipes[f"{itemID}"] = {
        "name": recipe_name,
        "itemID": itemID,
        # "iconURL": iconURL,
        # "description": description,
        "unlockConditions": unlockConditions,
        "ingredients": materials,
        "bigCraftable": bigCraftable,
    }

with open("./data/crafting_recipes.json", "w") as f:
    json.dump(craftingRecipes, f, indent=4)
