# Parsing all Cooking Recipes information from game files
# https://stardewvalleywiki.com/Modding:Recipe_data

import json

with open("../raw_data/CookingRecipes.json", "r") as f:
    rawData = json.load(f)

with open("../raw_data/CookingChannel.json", "r") as f:
    channelRecipes = json.load(f)

with open("./data/objects.json", "r") as f:
    objects = json.load(f)

# translate from CookingRecipes.json name to objects.json name
translations = {
    "Cookies": "Cookie",
    "Vegetable Stew": "Vegetable Medley",
    "Cran. Sauce": "Cranberry Sauce",
    "Cheese Cauli.": "Cheese Cauliflower",
    "Dish o' The Sea": "Dish O' The Sea",
    "Eggplant Parm.": "Eggplant Parmesan",
}

# categories: https://stardewvalleywiki.com/Modding:Items#Categories
categories = {
    "-4": "Any Fish",
    "-5": "Any Egg",
    "-6": "Any Milk"
}

# hardcoding these recipeSources that would need to be scraped
# if you want to avoid hardcoding you can look at the method from crafting_recipes.py
recipeSource = {
    "Cookie": "Evelyn (4-heart event).",
    "Triple Shot Espresso": "Stardrop Saloon for 5,000g.",
    "Ginger Ale": "Dwarf Shop in Volcano Dungeon for 1,000g.",
    "Banana Pudding": "Island Trader for 30 Bone Fragments.",
    "Tropical Curry": "Ginger Island Resort for 2,000g."
}

# get the names of all the the recipes unlocked through Queen of Sauce TV
# for some reason, the unlock condition for these is an unobtainable level in
# CookingRecipes.json so we have to find them this way 🙂
tv_recipes = set()
for val in channelRecipes["content"].values():
    tv_recipes.add(val.split("/")[0])

cookingRecipes = {}

for recipe_name, value in rawData["content"].items(): 
    if recipe_name in translations:
        recipe_name = translations[recipe_name]
    
    fields = value.split("/")
    
    ingredients = []
    # create the pairs of (itemID, amount)
    ingr = fields[0]
    i = iter(ingr.split(" "))
    pairs = map(" ".join, zip(i, i))
    for pair in pairs:
        item_id = pair.split(" ")[0]

        amount = pair.split(" ")[1]
        ingredients.append({
            "itemID": int(item_id),
            "amount": int(amount)
        })
    
    itemID = int(fields[2])
    
    unlockConditions = fields[3].split(" ")
    if (unlockConditions[0] == "default"): 
        unlockConditions = "Starter recipe - no steps required!"
    elif (unlockConditions[0] == "f"): # unlocked through friendship
        npc = unlockConditions[1]
        hearts = unlockConditions[2]
        unlockConditions = f"Reach {hearts} hearts with {npc}."
    elif (unlockConditions[0] == "l"): # unlocked through level
        unlockConditions = f"Reach farmer level {unlockConditions[1]}."
    elif (unlockConditions[0] == "s"): # unlocked through skill level
        skill = unlockConditions[1]
        level = unlockConditions[2]
        unlockConditions = f"Reach level {level} in {skill}."
    else:
        unlockConditions = "unknown"
        
    # hardcoding these since, for now, its only one.
    if (recipe_name in recipeSource.keys()):
        unlockConditions = recipeSource[recipe_name]

    if (recipe_name in tv_recipes):
        unlockConditions = "Unlocked through Queen of Sauce TV."
        
    iconURL = objects[str(itemID)]["iconURL"]
    description = objects[str(itemID)]["description"]
    
    cookingRecipes[f"{itemID}"] = {
        "name": recipe_name,
        "itemID": itemID,
        "iconURL": iconURL,
        "description": description,
        "unlockConditions": unlockConditions,
        "ingredients": ingredients
    }
    
with open("./data/cooking_recipes.json", "w") as f:
    json.dump(cookingRecipes, f, indent=4)
